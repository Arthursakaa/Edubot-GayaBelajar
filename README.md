<div align="center">

# 🤖 EduBot – Gaya Belajar Siswa
### Platform Pendukung Asesmen Preferensi Belajar Anak (VAK) Berbasis Machine Learning

[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/Python-v3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Framework Express](https://img.shields.io/badge/Express.js-v4.18-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Framework Flask](https://img.shields.io/badge/Flask-v3.1-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-v1.9-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-CDN-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/MySQL-MariaDB-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<br/>

**EduBot** adalah platform web cerdas dan ramah anak yang dirancang untuk membantu siswa sekolah dasar (SD) mengenali kecenderungan aktivitas belajarnya melalui pendekatan **VAK (*Visual, Auditory, Kinesthetic*)**. Dilengkapi dengan portal khusus guru, manajemen kelas, dan analitik distribusi gaya belajar kelas secara *real-time*.

[Jelajahi Fitur](#-fitur-utama) • [Mulai Cepat](#-panduan-instalasi--menjalankan-aplikasi) • [Dokumentasi API](#-dokumentasi-api-endpoint) • [Pengujian Otomatis](#-pengujian-otomatis-automated-testing)

</div>

---

> 💡 **Prinsip Pedagogis EduBot (*Anti-Fixed Mindset*)**:  
> Preferensi modalitas VAK diposisikan sebagai **kecenderungan aktivitas belajar yang dinamis dan fleksibel**, bukan sebagai pelabelan bakat permanen (*anti-fixed learning style myth*). Setiap anak dapat mengembangkan seluruh modalitas indranya sesuai konteks pelajaran.

---

## 🌟 Fitur Utama

### 🎒 1. Pengalaman Siswa (Kid-Friendly & Interaktif)
* **Kuis Petualangan 10 Soal**: Pertanyaan santai seputar aktivitas belajar sehari-hari yang mudah dipahami anak usia SD.
* **Lencana Karakter**: Siswa dapat memilih avatar seru (Robot, Roket, Bintang, Palet Lukis, Musik, Piala).
* **Pilihan Kelas Binaan**: Siswa dapat langsung memilih kelas gurunya melalui *dropdown* interaktif atau belajar secara mandiri.
* **Hasil Asesmen Holistik**: Menampilkan ilustrasi vektor SVG khusus sesuai gaya belajar dominan, grafik *Donut Chart* proporsi VAK (Visual, Auditori, Kinestetik), serta tips belajar praktis.
* **Cetak Lembar Hasil**: Dukungan cetak rapi lembar profil gaya belajar untuk ditunjukkan kepada orang tua di rumah.

### 👩‍🏫 2. Portal Guru & Analitik Kelas
* **Autentikasi Aman**: Registrasi dan login akun guru dengan proteksi *password hashing* **Bcrypt** dan sesi **JWT (*JSON Web Token*)**.
* **Manajemen Kelas (*Classroom Management*)**:
  * Guru dapat membuat kelas binaan (misal: *Kelas 4A SD Unggulan*).
  * Sistem otomatis menghasilkan **Kode Kuis** unik (misal: `VAK-4A`) yang dapat langsung disalin dan dibagikan ke siswa/orang tua.
* **Dashboard Analitik Dinamis**:
  * Filter visualisasi per kelas maupun rekapitulasi seluruh kelas.
  * Kartu KPI *real-time* (Total Siswa Terdata, Rata-rata Skor Visual, Auditori, dan Kinestetik).
  * Grafik Donut Distribusi Modalitas Kelas dan Bar Chart Nilai Rata-rata.
* **Tabel Riwayat & Ekspor Data**:
  * Pencarian instan (*live search*) nama siswa.
  * Unduh seluruh data hasil asesmen kelas dalam format **CSV** siap olah.

---

## 🏗️ Arsitektur Sistem

Aplikasi dibangun menggunakan arsitektur modular yang memisahkan frontend, backend API, dan microservice Machine Learning secara bersih:

```
[ Frontend Web (HTML5/Tailwind/Claymorphism) ]
       │                     │
       ▼                     ▼
[ Backend Express.js ] ──► [ Microservice ML Flask ]
  (Port 3000, Auth, DB)      (Port 8080, Scikit-learn)
       │
       ▼
[ Basis Data MySQL ]
  (Tabel users, classes, students, hasil_tes)
```

### Rincian Teknologi & Pustaka:
* **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (CDN), **Claymorphism Playful UI**, **Phosphor Icons** (`@phosphor-icons/web`), 9 Ilustrasi Vektor Open-Source **unDraw (MIT)**, Chart.js, Canvas-Confetti, Google Fonts (*Baloo 2* & *Nunito*).
* **Backend Aplikasi**: Node.js, Express.js (v4.18), MySQL2 Pool, Zod Schema Validator, Helmet Security Headers, Express Rate Limit, Bcryptjs, JsonWebToken (JWT).
* **Backend Machine Learning**: Python 3.10+, Flask, Flask-CORS, Scikit-learn (Decision Tree Classifier), Joblib, NumPy, Pandas.
* **Basis Data**: MySQL / MariaDB (XAMPP / Cloud Deployment).

---

## 📁 Struktur Repositori

```text
Edubot-GayaBelajar/
├── backend/                  # REST API Express.js & Integrasi Basis Data
│   ├── controllers/          # Logika bisnis (authController, classController, hasilController)
│   ├── middlewares/          # authMiddleware (JWT Guard) & errorHandler
│   ├── routes/               # api.js, authRoutes.js, classRoutes.js
│   ├── validators/           # Skema validasi ketat Zod (auth, class, simpanHasil)
│   ├── tests/                # Test suite otomatis (api.test.js, auth.test.js, classes.test.js)
│   ├── .env.example          # Template konfigurasi environment backend
│   ├── db.js                 # Connection pool MySQL2
│   ├── migrations.sql        # Skrip migrasi relasional non-destruktif
│   ├── schema.sql            # Skema lengkap DDL tabel basis data
│   ├── seed.js               # Inisialisasi akun demo guru & kelas demo
│   └── server.js             # Entrypoint server Express
│
├── backend-ml/               # Microservice Machine Learning Python Flask
│   ├── tests/                # Unit test pipeline ML (test_ml.py)
│   ├── app.py                # Server Flask API (/predict, /health)
│   ├── dataset_gayabelajar.csv# Dataset riil training modalitas belajar
│   ├── evaluate.py           # Evaluasi metrik Cross-Validation (Accuracy, F1, Matrix)
│   ├── model.py              # Skrip pelatihan Decision Tree Classifier
│   ├── model_gaya_belajar.pkl# Model ter-serialisasi Scikit-learn
│   └── requirements.txt      # Dependensi pustaka Python
│
├── components/               # Web Components modular
│   └── navbar.js             # Navigasi responsif adaptif sesi guru/siswa
│
├── images/                   # Ilustrasi vektor SVG resmi unDraw (MIT License)
│   ├── hero-belajar.svg      # Ilustrasi beranda
│   ├── gaya-visual.svg       # Ilustrasi modalitas visual
│   ├── gaya-auditori.svg     # Ilustrasi modalitas auditori
│   ├── gaya-kinestetik.svg   # Ilustrasi modalitas kinestetik
│   ├── guru-dashboard.svg    # Ilustrasi portal guru
│   └── ...                   # Ilustrasi lainnya
│
├── index.html                # Halaman Beranda EduBot
├── quiz.html                 # Halaman Kuis Interaktif Siswa
├── result.html               # Halaman Hasil Asesmen Profil VAK
├── teacher.html              # Halaman Dashboard Analitik Guru
├── login.html                # Halaman Masuk & Daftar Akun Guru
├── style.css                 # Sistem desain Claymorphism ramah anak
├── start-all.bat             # Skrip peluncur 1-klik untuk sistem Windows
├── package.json              # Pintasan skrip npm root & metadata proyek
└── README.md                 # Dokumentasi komprehensif proyek
```

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat Sistem
* [Node.js](https://nodejs.org/) (versi 20 atau lebih baru)
* [Python](https://www.python.org/) (versi 3.10 atau lebih baru)
* [MySQL / MariaDB](https://www.apachefriends.org/) (melalui XAMPP atau instalasi mandiri)

---

### 2. Konfigurasi Basis Data
1. Nyalakan modul **MySQL** pada XAMPP Control Panel.
2. Buat basis data `tes_gaya_belajar`:
   ```bash
   mysql -u root -e "CREATE DATABASE IF NOT EXISTS tes_gaya_belajar;"
   ```
3. Impor skema tabel:
   ```bash
   mysql -u root tes_gaya_belajar < backend/schema.sql
   ```
4. Inisialisasi akun demo guru & kelas demo:
   ```bash
   node --env-file=backend/.env backend/seed.js
   ```

---

### 3. Konfigurasi Environment (`backend/.env`)
Salin file template [backend/.env.example](file:///c:/Users/Arthur%20Saka/OneDrive/Documents/Edubot_GayaBelajar/Edubot-GayaBelajar/backend/.env.example) menjadi `backend/.env`:

```env
PORT=3000
ML_URL=http://127.0.0.1:8080
MYSQLHOST=127.0.0.1
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=
MYSQLDATABASE=tes_gaya_belajar
JWT_SECRET=edubot_secret_key_jwt_super_secure_2026
```

---

### 4. Instalasi Dependensi

**Backend Express (Node.js):**
```bash
cd backend
npm install
cd ..
```

**Backend Machine Learning (Python):**
```bash
# Membuat virtual environment (opsional namun disarankan)
python -m venv backend-ml/venv

# Mengaktifkan venv (Windows)
.\backend-ml\venv\Scripts\activate

# Menginstal dependensi ML
pip install -r backend-ml/requirements.txt
```

---

### 5. Menjalankan Seluruh Aplikasi

#### Opsi Praktis (1 Klik di Windows):
Cukup klik dua kali file **`start-all.bat`** di direktori utama. Tiga jendela terminal akan otomatis terbuka untuk menjalankan:
1. Microservice ML Flask (`http://localhost:8080`)
2. Backend Express API (`http://localhost:3000`)
3. Frontend Web Server (`http://localhost:5500`)

Buka browser Anda di **`http://localhost:5500`**.

#### Kredensial Akun Guru Demo:
* **Username**: `guru`
* **Kata Sandi**: `guru123`
* **Kode Kuis Demo**: `VAK-4A`

---

## 📡 Dokumentasi API Endpoint

### Backend Express API (`http://localhost:3000`)
| Method | Endpoint | Deskripsi | Otorisasi |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Health check koneksi server dan database MySQL | Publik |
| `POST` | `/api/auth/register` | Mendaftarkan akun guru baru | Publik |
| `POST` | `/api/auth/login` | Masuk akun guru & mendapatkan JWT token | Publik |
| `GET` | `/api/auth/me` | Mengambil profil sesi guru aktif | `Bearer Token` |
| `GET` | `/api/classes/public` | Daftar kelas aktif untuk dropdown kuis siswa | Publik |
| `GET` | `/api/classes` | Daftar kelas binaan guru beserta total murid | `Bearer Token` |
| `POST` | `/api/classes` | Membuat kelas baru & *generate* kode kuis | `Bearer Token` |
| `DELETE` | `/api/classes/:id` | Menghapus kelas binaan guru | `Bearer Token` |
| `POST` | `/api/simpan-hasil` | Menyimpan hasil kuis dan orkestrasi ke ML | Publik |
| `GET` | `/api/riwayat?limit=10` | Riwayat siswa (mendukung filter `?class_id=X`) | `Bearer Token` |
| `GET` | `/api/analytics` | Ringkasan statistik kelas (mendukung `?class_id=X`)| `Bearer Token` |

### Machine Learning Microservice (`http://localhost:8080`)
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/health` | Verifikasi status pemuatan model `.pkl` |
| `POST` | `/predict` | Prediksi klasifikasi gaya belajar dari vektor `[visual, auditory, kinesthetic]` |

---

## 🧪 Pengujian Otomatis (*Automated Testing*)

Proyek ini telah dilengkapi dengan rangkaian pengujian otomatis (*automated test suites*) untuk menjamin kestabilan seluruh modul:

```powershell
# 1. Uji Sistem Manajemen Kelas & Kode Kuis (6/6 Passed)
npm run test:classes

# 2. Uji Sistem Autentikasi Guru & JWT (6/6 Passed)
npm run test:auth

# 3. Uji Integrasi API & Keamanan Database (6/6 Passed)
npm run test:api

# 4. Uji Unit Pipeline Machine Learning Python (8/8 Passed)
npm run test:ml

# 5. Evaluasi Kualitas Model ML (Stratified K-Fold Cross-Validation)
npm run evaluate:ml
```

### Hasil Evaluasi Model Machine Learning (Dataset Riil):
* **Accuracy**: `70.00%`
* **Precision (Macro)**: `0.7306`
* **Recall (Macro)**: `0.7306`
* **F1-Score (Macro)**: `0.7190`
* Evaluasi dijalankan menggunakan *Stratified 2-Fold Cross Validation* pada dataset riil [backend-ml/dataset_gayabelajar.csv](file:///c:/Users/Arthur%20Saka/OneDrive/Documents/Edubot_GayaBelajar/Edubot-GayaBelajar/backend-ml/dataset_gayabelajar.csv) tanpa manipulasi sintetis.

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT License**. Lihat file `LICENSE` untuk informasi selengkapnya.

<div align="center">
  <sub>Dibangun dengan dedikasi untuk memajukan pendidikan anak sekolah dasar di Indonesia 🇮🇩</sub>
</div>
