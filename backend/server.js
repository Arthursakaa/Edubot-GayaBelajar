const express = require("express");
const cors = require("cors");
const axios = require("axios");
// Memanggil koneksi database dari file db.js
const db = require("./db"); 

const app = express();
app.use(cors());
app.use(express.json());

// ======================
// ENV
// ======================
const PORT = process.env.PORT || 3000;
const ML_URL = process.env.ML_URL;

// ======================
// ROUTE
// ======================
app.post("/simpan-hasil", async (req, res) => {
  const { nama, visual, auditory, kinesthetic, hasil } = req.body;

  let hasilFinal = hasil;

  // ===== ML (optional) =====
  try {
    if (ML_URL) {
      const mlResponse = await axios.post(`${ML_URL}/predict`, {
        visual,
        auditory,
        kinesthetic
      });

      if (mlResponse.data?.hasil) {
        hasilFinal = mlResponse.data.hasil;
      }
    }
  } catch (err) {
    console.warn("⚠️ ML gagal atau ML_URL tidak diset, pakai hasil frontend");
  }

  // ===== DB (menggunakan module db.js) =====
  const query = `
    INSERT INTO hasil_tes 
    (nama, visual, auditory, kinesthetic, hasil) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [nama, visual, auditory, kinesthetic, hasilFinal],
    (err, result) => {
      if (err) {
        // Ini akan memunculkan error detail di Railway Logs
        console.error("❌ ERROR DATABASE SAAT INSERT:", err);
      } else {
        console.log("✅ DATA BERHASIL DISIMPAN! ID:", result.insertId);
      }
    }
  );

  // ===== RESPONSE =====
  res.json({ hasil: hasilFinal });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});