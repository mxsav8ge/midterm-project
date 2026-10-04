@echo off
set "PATH=C:\xampp\php;%PATH%"
cd /d "%~dp0backend"
php artisan dev
pause
