const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const { notFoundHandler, globalErrorHandler } = require("./middlewares/errorHandler");

const app = express();

// 1. Keamanan HTTP Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// 2. CORS (Cross-Origin Resource Sharing)
app.use(cors());

// 3. Request Logging sederhana
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 4. Body parser dengan batas ukuran payload
app.use(express.json({ limit: "100kb" }));

const PORT = Number(process.env.PORT) || 3000;

// 5. Landing / Root status endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Backend Edubot is running and ready!",
    version: "1.1.0",
    docs: {
      health: "/health",
      api_prefix: "/api"
    }
  });
});

// 6. Registrasi API Routes
// Endpoint autentikasi guru & manajemen kelas
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/classes", classRoutes);
app.use("/api/classes", classRoutes);

// Dukungan backward compatibility untuk route root (/simpan-hasil dan /health)
app.use("/", apiRoutes);
// Route berstandar /api/
app.use("/api", apiRoutes);

// 7. Penanganan 404 & Global Error Middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start server jika dijalankan langsung
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server aktif di port ${PORT}`);
    console.log(`📍 Health Check : http://localhost:${PORT}/health`);
    console.log(`📍 API Endpoint : http://localhost:${PORT}/api/simpan-hasil`);
  });
}

module.exports = app;
