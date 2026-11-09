const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  getHealth,
  simpanHasil,
  getRiwayat,
  getAnalytics
} = require("../controllers/hasilController");

const router = express.Router();

// Rate limiter: batasi maksimal 30 submit kuis per 1 menit per IP
const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: "Terlalu banyak permintaan pengiriman hasil. Silakan coba lagi dalam beberapa saat."
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.get("/health", getHealth);
router.post("/simpan-hasil", submitLimiter, simpanHasil);
router.get("/riwayat", getRiwayat);
router.get("/analytics", getAnalytics);

module.exports = router;

