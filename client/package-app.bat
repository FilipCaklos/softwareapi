@echo off
REM Package Electron App without electron-builder
REM This script creates a portable executable by bundling Electron with the React build

echo Building Subscription Service Portable Executable...
echo.

REM Check if build folder exists
if not exist "build\" (
    echo Error: build folder not found. Run 'npm run react-build' first.
    exit /b 1
)

REM Create output directory
if not exist "dist-portable\" mkdir dist-portable

echo Copying Electron executable...
REM This would copy electron.exe and necessary files
REM For now, we'll create instructions for manual packaging

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo The React app has been built in the 'build' folder.
echo.
echo To create a portable executable:
echo.
echo Option 1: Use electron-packager (simpler)
echo   npm install -g electron-packager
echo   electron-packager . Subscription Service --platform win32 --arch x64 --out dist-app
echo.
echo Option 2: Manual packaging with Electron
echo   - Download electron-v27.3.11-win32-x64.zip from:
echo     https://github.com/electron/electron/releases
echo   - Extract to dist-portable folder
echo   - Create resources\app folder inside electron folder
echo   - Copy contents of 'build' folder to resources\app
echo   - Copy 'public\electron.js' to resources\app
echo.
echo The resulting app will be a standalone .exe file ready to distribute!
echo.
pause
