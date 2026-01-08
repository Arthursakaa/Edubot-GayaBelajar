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
    console.error("❌ DB GAGAL TERHUBUNG:", err.message);
    return;
  }
  console.log("✅ DB TERHUBUNG KE RAILWAY");
});

module.exports = db;