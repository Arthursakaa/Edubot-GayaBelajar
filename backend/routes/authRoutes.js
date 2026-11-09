const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login, getMe } = require("../controllers/authController");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rate limiter untuk mencegah serangan brute force pada login & register
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 15, // maksimal 15 percobaan per menit
  message: {
    success: false,
    error: "Terlalu banyak percobaan masuk/daftar. Silakan coba kembali setelah 1 menit."
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", requireAuth, getMe);

module.exports = router;

