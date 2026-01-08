const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
});

db.connect(err => {
  if (err) {
    console.error("❌ DB GAGAL TERHUBUNG:", err);
    return;
  }
  console.log("✅ DB TERHUBUNG KE RAILWAY");
});

module.exports = db;