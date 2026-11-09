const axios = require("axios");
const db = require("../db");
const { simpanHasilSchema } = require("../validators/simpanHasilValidator");

const ML_URL = process.env.ML_URL || "http://127.0.0.1:8080";

/**
 * Health check handler - memverifikasi server dan database connection
 */
const getHealth = (req, res) => {
  db.query("SELECT 1 AS status", (err) => {
    if (err) {
      return res.status(503).json({
        status: "degraded",
        message: "Server aktif tetapi koneksi basis data bermasalah",
        database: "disconnected",
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      status: "healthy",
      service: "EduBot Backend API",
      database: "connected",
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  });
};

/**
 * Menyimpan hasil kuis dan mengoordinasikan prediksi Machine Learning
 */
const simpanHasil = async (req, res, next) => {
  try {
    // 1. Validasi skema input dengan Zod
    const validationResult = simpanHasilSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((issue) => issue.message);
      return res.status(400).json({
        success: false,
        error: "Validasi data gagal",
        details: errorMessages
      });
    }

    const { nama, visual, auditory, kinesthetic, hasil, student_id } = validationResult.data;
    let hasilFinal = hasil;
    let source = "rule-based";

    // 2. Hubungi Machine Learning Server jika terkonfigurasi
    if (ML_URL) {
      try {
        console.log(`🤖 [ML] Menghubungi ML Server di ${ML_URL}/predict...`);
        const mlResponse = await axios.post(
          `${ML_URL}/predict`,
          { visual, auditory, kinesthetic },
          { timeout: 4000 }
        );

        if (mlResponse.data && mlResponse.data.hasil) {
          hasilFinal = mlResponse.data.hasil;
          source = "ml";
          console.log(`✅ [ML] Berhasil diprediksi oleh Machine Learning: ${hasilFinal}`);
        }
      } catch (err) {
        console.warn(`⚠️ [ML] Machine Learning Server tidak merespons (${err.message}). Menggunakan hasil rule-based lokal.`);
        source = "rule-based-fallback";
      }
    }

    // 3. Simpan ke database MySQL dengan parameterized query aman
    const query = `
      INSERT INTO hasil_tes (student_id, nama, visual, auditory, kinesthetic, hasil, source) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [student_id || null, nama, visual, auditory, kinesthetic, hasilFinal, source],
      (dbErr, result) => {
        if (dbErr) {
          console.error("❌ [DB ERROR]:", dbErr.message);
          return res.status(500).json({
            success: false,
            error: "Gagal menyimpan data ke basis data"
          });
        }

        console.log(`✅ [DB] Data tersimpan dengan ID: ${result.insertId} (Sumber: ${source})`);
        return res.status(201).json({
          success: true,
          id: result.insertId,
          hasil: hasilFinal,
          source: source
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mendapatkan riwayat hasil tes terbaru (fondasi awal Teacher Dashboard)
 */
const getRiwayat = (req, res, next) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const query = `
    SELECT id, student_id, nama, visual, auditory, kinesthetic, hasil, source, created_at 
    FROM hasil_tes 
    ORDER BY created_at DESC 
    LIMIT ?
  `;

  db.query(query, [limit], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: "Gagal mengambil riwayat hasil tes"
      });
    }

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  });
};

/**
 * Mendapatkan ringkasan analitik kelas untuk Teacher Dashboard
 */
const getAnalytics = (req, res, next) => {
  const querySummary = `
    SELECT 
      COUNT(*) AS total_tes,
      ROUND(AVG(visual), 1) AS avg_visual,
      ROUND(AVG(auditory), 1) AS avg_auditory,
      ROUND(AVG(kinesthetic), 1) AS avg_kinesthetic
    FROM hasil_tes;
  `;

  const queryBreakdown = `
    SELECT hasil, COUNT(*) AS jumlah 
    FROM hasil_tes 
    GROUP BY hasil;
  `;

  const queryRecent = `
    SELECT id, nama, visual, auditory, kinesthetic, hasil, source, created_at 
    FROM hasil_tes 
    ORDER BY created_at DESC 
    LIMIT 20;
  `;

  db.query(querySummary, (err1, summaryRows) => {
    if (err1) {
      return res.status(500).json({ success: false, error: "Gagal mengambil ringkasan analitik" });
    }

    db.query(queryBreakdown, (err2, breakdownRows) => {
      if (err2) {
        return res.status(500).json({ success: false, error: "Gagal mengambil distribusi gaya belajar" });
      }

      db.query(queryRecent, (err3, recentRows) => {
        if (err3) {
          return res.status(500).json({ success: false, error: "Gagal mengambil data siswa terbaru" });
        }

        const summary = summaryRows[0] || { total_tes: 0, avg_visual: 0, avg_auditory: 0, avg_kinesthetic: 0 };
        const distribution = {};
        breakdownRows.forEach(row => {
          distribution[row.hasil] = row.jumlah;
        });

        res.json({
          success: true,
          summary: {
            total_siswa: summary.total_tes,
            rata_rata: {
              visual: Number(summary.avg_visual) || 0,
              auditory: Number(summary.avg_auditory) || 0,
              kinesthetic: Number(summary.avg_kinesthetic) || 0
            }
          },
          distribution: distribution,
          recent_students: recentRows
        });
      });
    });
  });
};

module.exports = {
  getHealth,
  simpanHasil,
  getRiwayat,
  getAnalytics
};

