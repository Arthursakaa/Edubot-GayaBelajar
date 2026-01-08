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
const ML_URL = process.env.ML_URL;

// ======================
// DATABASE
// ======================
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
});

db.connect(err => {
  if (err) {
    console.error("❌ DB ERROR DETAIL:", err);
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

  // ===== ML (optional) =====
  try {
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

  // ===== DB (non-blocking) =====
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
        console.warn("⚠️ DB gagal simpan:", err.message);
      }
    }
  );

  // ===== RESPONSE (WAJIB) =====
  res.json({ hasil: hasilFinal });
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});