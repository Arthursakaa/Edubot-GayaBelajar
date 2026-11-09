-- =====================================================
-- EduBot Gaya Belajar - Database Enhancement Migration
-- Non-destructive migration: preserves existing data
-- =====================================================

USE tes_gaya_belajar;

-- 1. Tabel Users (Guru & Admin)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'teacher', 'student') NOT NULL DEFAULT 'teacher',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Classes (Kelas yang dibina guru)
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NULL,
    class_name VARCHAR(100) NOT NULL,
    grade_level VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_class_teacher FOREIGN KEY (teacher_id) 
        REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Students (Data Siswa)
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NULL,
    nisn VARCHAR(20) NULL UNIQUE,
    student_name VARCHAR(100) NOT NULL,
    gender ENUM('L', 'P') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_class FOREIGN KEY (class_id) 
        REFERENCES classes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Perluasan Kolom pada Tabel hasil_tes (tanpa menghapus data lama)
-- Tambah student_id jika belum ada
SET @dbname = DATABASE();
SET @tablename = "hasil_tes";
SET @columnname = "student_id";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE hasil_tes ADD COLUMN student_id INT NULL AFTER id, ADD CONSTRAINT fk_hasil_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Tambah source (asal prediksi) jika belum ada
SET @columnname = "source";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE hasil_tes ADD COLUMN source VARCHAR(30) DEFAULT 'ml' AFTER hasil;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Tambah class_code pada tabel classes jika belum ada
SET @tablename = "classes";
SET @columnname = "class_code";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE classes ADD COLUMN class_code VARCHAR(20) NULL UNIQUE AFTER class_name;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Tambah class_id pada tabel hasil_tes jika belum ada
SET @tablename = "hasil_tes";
SET @columnname = "class_id";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE hasil_tes ADD COLUMN class_id INT NULL AFTER student_id, ADD CONSTRAINT fk_hasil_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Indeks untuk efisiensi query analitik dan dashboard
CREATE INDEX idx_hasil_created ON hasil_tes(created_at);

