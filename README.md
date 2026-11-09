# EduBot – Platform Pendukung Asesmen Gaya Belajar Siswa (VAK)

EduBot adalah platform berbasis web untuk membantu siswa sekolah dasar (SD) mengenali preferensi aktivitas belajarnya menggunakan pendekatan **VAK (Visual, Auditory, Kinesthetic)**. Platform ini menghubungkan antarmuka interaktif yang ramah anak, backend API berbasis Node.js Express, penyimpanan relasional MySQL, serta microservice Machine Learning berbasis Python Flask (Decision Tree Classifier).

> **Prinsip Pedagogis**: Preferensi VAK diposisikan sebagai **kecenderungan modalitas aktivitas belajar yang fleksibel dan dinamis**, bukan sebagai pelabelan bakat permanen bagi siswa (*anti-fixed learning style myth*).

---

## 1. Arsitektur & Teknologi

* **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (CDN), **Claymorphism Playful Design System**, **Phosphor Icons** (`@phosphor-icons/web`), **unDraw Open-Source Vector Illustrations** (`images/*.svg`), Chart.js, Canvas-Confetti, Google Fonts (**Baloo 2** & **Nunito**).
* **Backend Aplikasi**: Node.js (v24), Express.js (v4.18), Axios, MySQL2 Pool, Zod (Schema Validator), Helmet (HTTP Security), Express Rate Limit.
* **Backend Machine Learning**: Python (v3.14), Flask (v3.1), Flask-CORS, Scikit-learn (v1.9), Joblib, NumPy, Pandas.
* **Basis Data**: MySQL / MariaDB (XAMPP).
* **Agent Skills**: `ui-ux-pro-max` (UI/UX Design System Intelligence untuk antarmuka EdTech ramah anak tanpa ketergantungan emoji).

---

## 2. Daftar Library & Versi Dependensi

### Backend Node.js (`backend/package.json`)
| Library | Versi | Kegunaan |
| :--- | :--- | :--- |
| `express` | `^4.18.2` | Framework server REST API HTTP |
| `cors` | `^2.8.5` | Penanganan Cross-Origin Resource Sharing |
| `axios` | `^1.6.0` | HTTP Client orkestrasi ke microservice ML Flask |
| `mysql2` | `^3.6.0` | Connection pool basis data MySQL |
| `zod` | `^4.6.7` | Validasi skema payload JSON request (Strict Validation) |
| `helmet` | `^8.3.0` | Proteksi keamanan HTTP Response Headers |
| `express-rate-limit` | `^8.7.3` | Pembatasan frekuensi request untuk mencegah spam submission |

### Backend Machine Learning (`backend-ml/requirements.txt`)
| Library | Versi | Kegunaan |
| :--- | :--- | :--- |
| `flask` | `^3.1.3` | Micro-framework REST API Python |
| `flask-cors` | `^6.0.5` | CORS handler microservice Flask |
| `scikit-learn` | `^1.9.1` | Pelatihan model Decision Tree & metrik evaluasi |
| `joblib` | `^1.6.0` | Model serialization (`model_gaya_belajar.pkl`) |
| `numpy` | `^2.5.4` | Operasi array & vektor fitur |
| `pandas` | `^3.1.1` | Manipulasi dan analisis data tabular |

### Frontend UI Pustaka & Aset Vektor
* **Phosphor Icons** (`@phosphor-icons/web@2.1.1` via CDN): Ikon vektor duotone & bold pengganti emoji untuk konsistensi lintas sistem operasi.
* **unDraw Vector Illustrations** (`images/*.svg`): 9 ilustrasi SVG open-source (MIT License) yang dikustomisasi sesuai warna identitas VAK (`#2563EB` Visual, `#F59E0B` Auditori, `#10B981` Kinestetik).
* **Chart.js** (`4.4.x`): Visualisasi Donut Chart profil VAK siswa dan Bar Chart analitik kelas pada Dashboard Guru.
* **Canvas-Confetti** (`1.9.3`): Efek perayaan kembang api kertas visual saat kuis selesai.
* **Google Fonts (`Baloo 2` & `Nunito`)**: Tipografi bulat ramah anak dengan legibilitas tinggi untuk siswa usia SD.

---

## 3. Konfigurasi Environment (`backend/.env`)

Buat file `.env` di dalam folder `backend/`:

```env
PORT=3000
ML_URL=http://127.0.0.1:8080
MYSQLHOST=127.0.0.1
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=
MYSQLDATABASE=tes_gaya_belajar
```

---

## 4. Struktur Database & Skema Relasional

Database menggunakan basis data **`tes_gaya_belajar`**. Skema yang disiapkan telah dinormalisasi untuk mendukung pengembangan **Teacher Dashboard** dan **Student Dashboard**:

1. **`users`**: Akun guru dan pengelola sistem (username, password_hash, role `['teacher', 'admin', 'student']`).
2. **`classes`**: Kelas binaan guru (class_name, grade_level, academic_year, relasi ke `users.id`).
3. **`students`**: Data peserta didik (student_name, nisn, gender, relasi ke `classes.id`).
4. **`hasil_tes`**: Riwayat hasil asesmen (student_id, nama, visual, auditory, kinesthetic, hasil, source `['ml', 'rule-based']`, created_at).

Migrasi basis data dapat dijalankan melalui:
```bash
mysql -u root tes_gaya_belajar < backend/migrations.sql
```

---

## 5. Dokumentasi API Endpoint

### Backend Express API (`http://localhost:3000`)
| Method | Endpoint | Deskripsi | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Informasi status layanan backend | `200 OK` |
| `GET` | `/health` atau `/api/health` | Health check koneksi server & basis data | `200 OK` / `503 Service Unavailable` |
| `POST` | `/simpan-hasil` atau `/api/simpan-hasil` | Menyimpan hasil kuis, validasi Zod, dan orkestrasi ke ML | `201 Created` / `400 Bad Request` |
| `GET` | `/api/riwayat?limit=10` | Mengambil data riwayat asesmen terbaru (Dashboard) | `200 OK` |
| `GET` | `/api/analytics` | Mengambil ringkasan statistik & distribusi VAK kelas untuk Dashboard Guru | `200 OK` |

**Format Payload `POST /api/simpan-hasil`:**
```json
{
  "nama": "Ahmad Fauzi",
  "visual": 5,
  "auditory": 3,
  "kinesthetic": 2,
  "hasil": "visual"
}
```

### Machine Learning Microservice (`http://localhost:8080`)
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/` | Status microservice ML |
| `GET` | `/health` | Verifikasi status pemuatan model `.pkl` |
| `POST` | `/predict` | Prediksi inferensi vektor `[visual, auditory, kinesthetic]` |

---

## 6. Evaluasi Machine Learning (Dataset Riil)

Evaluasi dilakukan pada dataset asli [backend-ml/dataset_gayabelajar.csv](file:///c:/Users/Arthur%20Saka/OneDrive/Documents/Edubot_GayaBelajar/Edubot-GayaBelajar/backend-ml/dataset_gayabelajar.csv) ($N=20$) tanpa manipulasi sintetis menggunakan **Stratified K-Fold Cross-Validation (k=2)**:

* **Accuracy**: `70.00%` (0.7000)
* **Precision (Macro)**: `0.7306`
* **Recall (Macro)**: `0.7306`
* **F1-Score (Macro)**: `0.7190`
* **F1-Score (Weighted)**: `0.7086`

Jalankan evaluasi ulang kapan saja dengan perintah:
```bash
.\backend-ml\venv\Scripts\python.exe backend-ml\evaluate.py
```

---

## 7. Cara Menjalankan Seluruh Komponen

### Opsi Praktis (1 Klik di Windows)
Klik dua kali file **`start-all.bat`** di direktori utama project. Tiga terminal akan terbuka secara otomatis untuk masing-masing service.

### Opsi Terminal Terpisah di VS Code
1. **Terminal 1 (Backend ML - Port 8080)**:
   ```powershell
   .\backend-ml\venv\Scripts\python.exe backend-ml\app.py
   ```
2. **Terminal 2 (Backend Express - Port 3000)**:
   ```powershell
   node --env-file=backend\.env backend\server.js
   ```
3. **Terminal 3 (Frontend Web - Port 5500)**:
   ```powershell
   .\backend-ml\venv\Scripts\python.exe -m http.server 5500
   ```
   *Buka browser di `http://localhost:5500`.*

---

## 8. Menjalankan Pengujian Otomatis (Automated Testing)

### A. Uji Integrasi API Backend Express & Database:
```powershell
node --env-file=backend\.env backend\tests\api.test.js
```
*Menguji endpoint health check, validasi skema Zod, mitigasi error, serta penyimpanan record ke MySQL.*

### B. Uji Unit & Pipeline Machine Learning Python:
```powershell
.\backend-ml\venv\Scripts\python.exe -m unittest backend-ml/tests/test_ml.py
```
*Menguji pemuatan model `.pkl`, endpoint Flask `/health`, validasi input, penskalaan fitur domain (skala 10 ke 5), dan heuristik.*

### C. Evaluasi Metrik Model (Cross-Validation pada Dataset Asli):
```powershell
.\backend-ml\venv\Scripts\python.exe backend-ml\evaluate.py
```
*Menghitung Accuracy, Precision, Recall, F1-Score, dan Confusion Matrix secara ilmiah.*

