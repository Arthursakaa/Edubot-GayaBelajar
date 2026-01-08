const mysql = require("mysql2");

// Gunakan MYSQL_URL jika ada, jika tidak ada gunakan objek konfigurasi
const connectionConfig = process.env.MYSQL_URL || {
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT) || 3306,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
};

const db = mysql.createConnection(connectionConfig);

db.connect(err => {
  if (err) {
    // Tambahkan log detail di sini
    console.error("❌ DB GAGAL TERHUBUNG!");
    console.error("Pesan Error:", err.message);
    console.error("Kode Error:", err.code);
    return;
  }
  console.log("✅ DATABASE TERHUBUNG (RAILWAY)");
});

module.exports = db;