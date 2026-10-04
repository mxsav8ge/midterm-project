@echo off
set "PATH=%LOCALAPPDATA%\Android\Sdk\emulator;%LOCALAPPDATA%\Android\Sdk\platform-tools;%PATH%"
echo ========================================================
echo Launching Android Emulator: Pixel_9a (No Android Studio Needed!)
echo ========================================================
emulator -avd Pixel_9a
pause
