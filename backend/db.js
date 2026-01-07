const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tes_gaya_belajar"
});

db.connect(err => {
  if (err) {
    console.log("❌ DB GAGAL TERHUBUNG");
    return;
  }
  console.log("✅ DB TERHUBUNG");
});

module.exports = db;
