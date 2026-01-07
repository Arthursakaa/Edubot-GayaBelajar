const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ==========================
// ENV
// ==========================
const PORT = process.env.PORT || 3000;
const ML_URL = process.env.ML_URL; // ⚠️ TANPA default localhost

// ==========================
// DATABASE (WAJIB CLOUD)
// ==========================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

db.connect(err => {
    if (err) {
        console.error("❌ DB ERROR:", err.message);
    } else {
        console.log("✅ MySQL connected");
    }
});

// ==========================
// ROUTE
// ==========================
app.post("/simpan-hasil", async (req, res) => {
    console.log("📥 DATA MASUK:", req.body);

    const { nama, visual, auditory, kinesthetic, hasil } = req.body;

    let hasil_final = hasil; // fallback dari frontend

    // 🔥 JIKA ML SUDAH ADA
    if (ML_URL) {
        try {
            const mlResponse = await axios.post(
                `${ML_URL}/predict`,
                { visual, auditory, kinesthetic }
            );
            hasil_final = mlResponse.data.hasil;
        } catch (err) {
            console.warn("⚠️ ML tidak tersedia, pakai hasil frontend");
        }
    }

    const query = `
        INSERT INTO hasil_tes 
        (nama, visual, auditory, kinesthetic, hasil, created_at)
        VALUES (?, ?, ?, ?, ?, CURDATE())
    `;

    db.query(
        query,
        [nama, visual, auditory, kinesthetic, hasil_final],
        err => {
            if (err) {
                console.error("❌ INSERT ERROR:", err.message);
                return res.status(500).json({ message: "Gagal simpan data" });
            }

            res.json({
                message: "✅ Data berhasil disimpan",
                hasil: hasil_final
            });
        }
    );
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
