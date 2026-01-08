const express = require("express");
const cors = require("cors");
const axios = require("axios");
const db = require("./db"); 

const app = express();

// Middleware Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ML_URL = process.env.ML_URL;

// Rute Akar (Cek status server)
app.get("/", (req, res) => {
  res.send("🚀 Backend Edubot is running and ready!");
});

app.post("/simpan-hasil", async (req, res) => {
  console.log("📦 Data diterima dari Frontend:", req.body);

  const { nama, visual, auditory, kinesthetic, hasil } = req.body;
  let hasilFinal = hasil;

  // ===== Proses ML (Optional) =====
  if (ML_URL) {
    try {
      console.log("🤖 Menghubungi ML Server...");
      const mlResponse = await axios.post(`${ML_URL}/predict`, {
        visual, auditory, kinesthetic
      }, { timeout: 4000 });

      if (mlResponse.data?.hasil) {
        hasilFinal = mlResponse.data.hasil;
        console.log("✅ ML Berhasil: ", hasilFinal);
      }
    } catch (err) {
      console.warn("⚠️ ML Gagal/Timeout, menggunakan hasil lokal.");
    }
  }

  // ===== Simpan ke Database =====
  const query = `
    INSERT INTO hasil_tes (nama, visual, auditory, kinesthetic, hasil) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [nama, visual, auditory, kinesthetic, hasilFinal], (err, result) => {
    if (err) {
      console.error("❌ ERROR DATABASE:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
    console.log("✅ DATA TERSIMPAN! ID:", result.insertId);
    res.json({ success: true, hasil: hasilFinal });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server aktif di port ${PORT}`);
});