-- =====================================================
-- EduBot Gaya Belajar - Database Schema
-- Compatible with MySQL 8.0+ / MariaDB 10.4+ (XAMPP / Railway)
-- =====================================================

CREATE DATABASE IF NOT EXISTS tes_gaya_belajar;
USE tes_gaya_belajar;

-- 1. Tabel Users (Guru & Administrator)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'teacher', 'student') NOT NULL DEFAULT 'teacher',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Classes (Kelas Binaan Guru)
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NULL,
    class_name VARCHAR(100) NOT NULL,
    class_code VARCHAR(20) NULL UNIQUE,
    grade_level VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_class_teacher FOREIGN KEY (teacher_id) 
        REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Students (Data Peserta Didik)
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

-- 4. Tabel Hasil Tes Gaya Belajar (VAK)
CREATE TABLE IF NOT EXISTS hasil_tes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NULL,
    class_id INT NULL,
    nama VARCHAR(100) NOT NULL,
    visual INT NOT NULL,
    auditory INT NOT NULL,
    kinesthetic INT NOT NULL,
    hasil VARCHAR(50) NOT NULL,
    source VARCHAR(30) DEFAULT 'ml',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hasil_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
    CONSTRAINT fk_hasil_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
    INDEX idx_hasil_created (created_at),
    INDEX idx_hasil_class (class_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
