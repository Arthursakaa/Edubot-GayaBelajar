const mysql = require("mysql2");

const connectionConfig = process.env.MYSQL_URL || {
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT) || 3306,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
};

// Menggunakan Pool agar lebih stabil di Railway
const db = mysql.createPool(connectionConfig);

// Verifikasi koneksi awal
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB GAGAL TERHUBUNG!");
    console.error("Pesan Error:", err.message);
  } else {
    console.log("✅ DATABASE TERHUBUNG VIA POOL (RAILWAY)");
    connection.release();
  }
});

module.exports = db;