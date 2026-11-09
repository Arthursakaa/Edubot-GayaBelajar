const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "edubot_secret_key_jwt_super_secure_2026";

/**
 * Middleware untuk memverifikasi autentikasi JWT token
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Akses ditolak: Token autentikasi tidak ditemukan. Silakan masuk terlebih dahulu."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Sesi Anda telah berakhir atau token tidak valid. Silakan masuk kembali."
    });
  }
};

/**
 * Middleware untuk otorisasi berbasis peran (Role-Based Access Control)
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Akses dilarang: Anda tidak memiliki izin untuk mengakses fitur ini."
      });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole
};

