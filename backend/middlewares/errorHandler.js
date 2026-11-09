/**
 * Middleware untuk menangani request ke route yang tidak ditemukan (404)
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.originalUrl}' tidak ditemukan pada server EduBot`
  });
};

/**
 * Global Error Handler Middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error("🔥 [UNHANDLED ERROR]:", err);

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    error: isProduction ? "Terjadi kesalahan internal pada server" : err.message || "Internal Server Error"
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler
};

