$env:PATH = "$env:LOCALAPPDATA\Android\Sdk\emulator;$env:LOCALAPPDATA\Android\Sdk\platform-tools;" + $env:PATH
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Launching Android Emulator: Pixel_9a" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
emulator -avd Pixel_9a
