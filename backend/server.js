const express = require("express");
const cors = require("cors");
const axios = require("axios");
const db = require("./db"); 

const app = express();

// 1. Tambahkan log untuk setiap request yang masuk (Debugging)
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ML_URL = process.env.ML_URL;

app.post("/simpan-hasil", async (req, res) => {
  // 2. Log data yang diterima dari Frontend
  console.log("📦 Data received from Frontend:", req.body);

  const { nama, visual, auditory, kinesthetic, hasil } = req.body;
  let hasilFinal = hasil;

  // ===== ML Logic with Timeout =====
  if (ML_URL) {
    try {
      console.log("🤖 Attempting ML Prediction...");
      const mlResponse = await axios.post(`${ML_URL}/predict`, {
        visual,
        auditory,
        kinesthetic
      }, { timeout: 3000 }); // Maksimal nunggu 3 detik agar tidak macet

      if (mlResponse.data?.hasil) {
        hasilFinal = mlResponse.data.hasil;
        console.log("✅ ML Prediction Success:", hasilFinal);
      }
    } catch (err) {
      console.warn("⚠️ ML skip/error, using frontend result.");
    }
  }

  // ===== DB INSERT =====
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
        console.error("❌ DATABASE ERROR:", err.message);
        // Tetap kirim respon ke user meskipun DB gagal
        return res.status(500).json({ error: "Database failure", detail: err.message });
      } else {
        console.log("✅ DATA SAVED TO DB! ID:", result.insertId);
        // Kirim respon sukses
        res.json({ success: true, hasil: hasilFinal });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});