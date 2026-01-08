const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ======================
// ENV
// ======================
const PORT = process.env.PORT || 3000;
const ML_URL = process.env.ML_URL || "http://localhost:5000";

// ======================
// DATABASE
// ======================
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) {
    console.error("❌ DB ERROR:", err);
  } else {
    console.log("✅ MySQL connected");
  }
});

// ======================
// ROUTE
// ======================
app.post("/simpan-hasil", async (req, res) => {
  const { nama, visual, auditory, kinesthetic, hasil } = req.body;

  let hasilFinal = hasil;

  try {
    // 🔹 Coba pakai ML dulu
    const mlResponse = await axios.post(`${ML_URL}/predict`, {
      visual,
      auditory,
      kinesthetic
    });

    if (mlResponse.data?.hasil) {
      hasilFinal = mlResponse.data.hasil;
    }
  } catch (err) {
    console.warn("⚠️ ML gagal, pakai hasil frontend");
  }

  // 🔹 Coba simpan DB (non-blocking)
  const query = `
    INSERT INTO hasil_tes
    (nama, visual, auditory, kinesthetic, hasil)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [nama, visual, auditory, kinesthetic, hasilFinal],
    err => {
      if (err) {
        console.warn("⚠️ DB gagal simpan, lanjutkan:", err.message);
      }
    }
  );

  // 🔹 PASTI balikin hasil
  res.json({ hasil: hasilFinal });
});

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "ML Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
