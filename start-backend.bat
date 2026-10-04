@echo off
set "PATH=C:\xampp\php;%PATH%"
cd /d "%~dp0backend"
echo ========================================================
echo Starting Laravel Backend API on http://0.0.0.0:8000
echo ========================================================
php artisan serve --host=0.0.0.0 --port=8000
pause
