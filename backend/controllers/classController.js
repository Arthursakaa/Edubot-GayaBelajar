const db = require("../db");
const { createClassSchema } = require("../validators/classValidator");

/**
 * Mengambil daftar kelas aktif untuk siswa (Dropdown Kuis)
 */
const getPublicClasses = (req, res, next) => {
  const sql = `
    SELECT 
      c.id, 
      c.class_name, 
      c.class_code, 
      c.grade_level, 
      c.academic_year,
      u.full_name AS teacher_name
    FROM classes c
    LEFT JOIN users u ON c.teacher_id = u.id
    ORDER BY c.class_name ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) return next(err);
    res.json({
      success: true,
      data: rows || []
    });
  });
};

/**
 * Mengambil kelas binaan guru yang sedang login beserta jumlah siswa
 */
const getTeacherClasses = (req, res, next) => {
  const teacherId = req.user.id;
  const isTeacher = req.user.role === "teacher";

  let sql = `
    SELECT 
      c.id,
      c.teacher_id,
      c.class_name,
      c.class_code,
      c.grade_level,
      c.academic_year,
      c.created_at,
      COUNT(h.id) AS total_siswa
    FROM classes c
    LEFT JOIN hasil_tes h ON c.id = h.class_id
  `;

  const params = [];
  if (isTeacher) {
    sql += " WHERE c.teacher_id = ?";
    params.push(teacherId);
  }

  sql += " GROUP BY c.id ORDER BY c.created_at DESC";

  db.query(sql, params, (err, rows) => {
    if (err) return next(err);
    res.json({
      success: true,
      data: rows || []
    });
  });
};

/**
 * Membuat kelas baru oleh guru
 */
const createClass = (req, res, next) => {
  const teacherId = req.user.id;

  const parseResult = createClassSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: "Validasi kelas gagal",
      details: parseResult.error.issues.map((i) => i.message)
    });
  }

  const { class_name, grade_level, academic_year } = parseResult.data;
  let class_code = parseResult.data.class_code;

  if (!class_code) {
    // Generate kode otomatis unik: mis. VAK-4A92
    const cleanPrefix = class_name.replace(/[^a-zA-Z0-9]/g, "").substring(0, 3).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    class_code = `VAK-${cleanPrefix || "KLS"}-${randomSuffix}`;
  }

  // Cek duplikasi kode kelas
  db.query("SELECT id FROM classes WHERE class_code = ? LIMIT 1", [class_code], (checkErr, existing) => {
    if (checkErr) return next(checkErr);
    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: `Kode kelas "${class_code}" sudah digunakan. Silakan gunakan kode lain.`
      });
    }

    const insertSql = `
      INSERT INTO classes (teacher_id, class_name, class_code, grade_level, academic_year)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertSql, [teacherId, class_name, class_code, grade_level, academic_year], (insertErr, result) => {
      if (insertErr) return next(insertErr);

      const createdClass = {
        id: result.insertId,
        teacher_id: teacherId,
        class_name,
        class_code,
        grade_level,
        academic_year,
        total_siswa: 0
      };

      res.status(201).json({
        success: true,
        message: `Kelas "${class_name}" dengan kode ${class_code} berhasil dibuat!`,
        data: createdClass
      });
    });
  });
};

/**
 * Menghapus kelas oleh guru yang bersangkutan
 */
const deleteClass = (req, res, next) => {
  const teacherId = req.user.id;
  const classId = Number(req.params.id);

  if (!classId) {
    return res.status(400).json({ success: false, error: "ID kelas tidak valid" });
  }

  db.query("DELETE FROM classes WHERE id = ? AND teacher_id = ?", [classId, teacherId], (err, result) => {
    if (err) return next(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Kelas tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya"
      });
    }

    res.json({
      success: true,
      message: "Kelas berhasil dihapus"
    });
  });
};

module.exports = {
  getPublicClasses,
  getTeacherClasses,
  createClass,
  deleteClass
};

