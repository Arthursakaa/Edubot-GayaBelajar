const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ==========================
// KONEKSI DATABASE
// ==========================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tes_gaya_belajar"
});

db.connect(err => {
    if (err) {
        console.error("❌ DB ERROR:", err);
    } else {
        console.log("✅ MySQL connected");
    }
});

// ==========================
// ROUTE SIMPAN HASIL + ML
// ==========================
app.post("/simpan-hasil", async (req, res) => {
    console.log("📥 DATA MASUK:", req.body);
    
    const { nama, visual, auditory, kinesthetic, hasil } = req.body;

    try {
        // 🔥 PANGGIL ML PYTHON
        const mlResponse = await axios.post(
            "http://localhost:5000/predict",
            {
                visual,
                auditory,
                kinesthetic
            }
        );

        const hasil_ml = mlResponse.data.hasil;

        // 🔥 SIMPAN KE MYSQL
        const query = `
            INSERT INTO hasil_tes 
            (nama, visual, auditory, kinesthetic, hasil)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            query,
            [nama, visual, auditory, kinesthetic, hasil_ml],
            (err) => {
                if (err) {
                    console.error("❌ INSERT ERROR:", err);
                    return res.status(500).json({
                        message: "Gagal simpan data"
                    });
                }

                res.json({
                    message: "✅ Data berhasil disimpan",
                    hasil: hasil_ml
                });
            }
        );

    } catch (error) {
        console.error("❌ ML ERROR:", error.message);
        res.status(500).json({
            message: "Gagal memproses ML"
        });
    }
});

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
