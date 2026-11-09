const bcrypt = require("bcryptjs");
const db = require("./db");

async function seed() {
  const defaultUsername = "guru";
  const defaultPassword = "guru123";
  const defaultFullName = "Bapak/Ibu Guru EduBot";
  const defaultRole = "teacher";

  db.query(
    "SELECT id FROM users WHERE username = ? LIMIT 1",
    [defaultUsername],
    async (err, rows) => {
      if (err) {
        console.error("❌ Gagal mengecek tabel users:", err.message);
        process.exit(1);
      }

      let teacherId;

      if (rows && rows.length > 0) {
        console.log(`ℹ️ Akun demo "${defaultUsername}" sudah tersedia di database.`);
        teacherId = rows[0].id;
        seedClass(teacherId);
      } else {
        try {
          const hash = await bcrypt.hash(defaultPassword, 10);
          db.query(
            "INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)",
            [defaultUsername, hash, defaultFullName, defaultRole],
            (insertErr, insertRes) => {
              if (insertErr) {
                console.error("❌ Gagal menyisipkan akun demo:", insertErr.message);
                process.exit(1);
              }
              console.log(`✅ Berhasil membuat akun demo guru:`);
              console.log(`   Username : ${defaultUsername}`);
              console.log(`   Password : ${defaultPassword}`);
              teacherId = insertRes.insertId;
              seedClass(teacherId);
            }
          );
        } catch (hashErr) {
          console.error("❌ Gagal hashing password:", hashErr.message);
          process.exit(1);
        }
      }
    }
  );
}

function seedClass(teacherId) {
  const sampleCode = "VAK-4A";
  db.query(
    "SELECT id FROM classes WHERE class_code = ? LIMIT 1",
    [sampleCode],
    (err, rows) => {
      if (err) {
        console.error("❌ Gagal memeriksa kelas demo:", err.message);
        process.exit(1);
      }

      if (rows && rows.length > 0) {
        console.log(`ℹ️ Kelas demo "${sampleCode}" sudah tersedia di database.`);
        process.exit(0);
      }

      db.query(
        "INSERT INTO classes (teacher_id, class_name, class_code, grade_level, academic_year) VALUES (?, ?, ?, ?, ?)",
        [teacherId, "Kelas 4A (SD Unggulan)", sampleCode, "Kelas 4", "2025/2026"],
        (insertErr) => {
          if (insertErr) {
            console.error("❌ Gagal membuat kelas demo:", insertErr.message);
            process.exit(1);
          }
          console.log(`✅ Berhasil membuat kelas demo:`);
          console.log(`   Nama Kelas  : Kelas 4A (SD Unggulan)`);
          console.log(`   Kode Kelas  : ${sampleCode}`);
          console.log(`   Tingkat     : Kelas 4 (2025/2026)`);
          process.exit(0);
        }
      );
    }
  );
}

seed();
