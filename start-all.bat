@echo off
title EduBot - Gaya Belajar Launcher
echo ===================================================
echo   Menjalankan Seluruh Komponen EduBot Gaya Belajar
echo ===================================================
echo.

echo [1/3] Menjalankan Backend Machine Learning (Port 8080)...
start "EduBot - ML Server (Port 8080)" cmd /k "title ML Server (8080) && .\backend-ml\venv\Scripts\python.exe backend-ml\app.py"

timeout /t 2 /nobreak >nul

echo [2/3] Menjalankan Backend Express (Port 3000)...
start "EduBot - Backend API (Port 3000)" cmd /k "title Backend Express (3000) && node --env-file=backend\.env backend\server.js"

timeout /t 2 /nobreak >nul

echo [3/3] Menjalankan Frontend Web Server (Port 5500)...
start "EduBot - Frontend (Port 5500)" cmd /k "title Frontend Web (5500) && .\backend-ml\venv\Scripts\python.exe -m http.server 5500"

echo.
echo ===================================================
echo Seluruh komponen berhasil diluncurkan!
echo - Frontend:  http://localhost:5500
echo - Backend:   http://localhost:3000
echo - ML Server: http://localhost:8080
echo ===================================================
echo Tekan tombol apa saja untuk menutup launcher ini (jendela server tetap berjalan).
pause >nul

