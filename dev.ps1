$env:PATH = "C:\xampp\php;" + $env:PATH
Set-Location -Path "$PSScriptRoot\backend"
php artisan dev
