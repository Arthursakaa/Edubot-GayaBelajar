const mysql = require("mysql2");

const isLocalHost =
  !process.env.MYSQLHOST ||
  process.env.MYSQLHOST === "127.0.0.1" ||
  process.env.MYSQLHOST === "localhost";

const needsSSL =
  process.env.MYSQL_SSL === "true" ||
  (!isLocalHost && Number(process.env.MYSQLPORT) === 4000) ||
  (process.env.MYSQLHOST && process.env.MYSQLHOST.includes("tidbcloud.com"));

const connectionConfig = process.env.MYSQL_URL || {
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT) || 3306,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  ...(needsSSL ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } } : {})
};

const db = mysql.createPool(connectionConfig);

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB GAGAL TERHUBUNG!");
    console.error("Pesan Error:", err.message);
  } else {
    console.log(`✅ DATABASE TERHUBUNG VIA POOL${needsSSL ? " (SSL/TLS)" : ""}`);
    connection.release();
  }
});

module.exports = db;
