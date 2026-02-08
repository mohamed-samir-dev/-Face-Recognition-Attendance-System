@echo off
echo ========================================
echo IntelliAttend System Check
echo ========================================
echo.

set "errors=0"

echo [1/8] Checking Python...
where python >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do set pyver=%%i
    echo OK: Python installed - Version: %pyver%
) else (
    echo ERROR: Python not installed!
    echo Install Python 3.8+ from: https://www.python.org/downloads/
    set /a errors+=1
)
echo.

echo [2/8] Checking Node.js...
where node >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set nodever=%%i
    echo OK: Node.js installed - Version: %nodever%
) else (
    echo ERROR: Node.js not installed!
    echo Install Node.js 18+ from: https://nodejs.org/
    set /a errors+=1
)
echo.

echo [3/8] Checking npm...
where npm >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set npmver=%%i
    echo OK: npm installed - Version: %npmver%
) else (
    echo ERROR: npm not installed!
    set /a errors+=1
)
echo.

echo [4/8] Checking Firebase file...
if exist "user-login-data-7d185-firebase-adminsdk-fbsvc-3c8a31d30f.json" (
    echo OK: Firebase file found
) else (
    echo ERROR: Firebase file not found!
    set /a errors+=1
)
echo.

echo [5/8] Checking Backend folder...
if exist "backend\" (
    echo OK: Backend folder found
    if exist "backend\enhanced_face_api_server.py" (
        echo OK: Server file found
    ) else (
        echo ERROR: Server file not found!
        set /a errors+=1
    )
) else (
    echo ERROR: Backend folder not found!
    set /a errors+=1
)
echo.

echo [6/8] Checking Frontend folder...
if exist "frontend\" (
    echo OK: Frontend folder found
    if exist "frontend\package.json" (
        echo OK: package.json found
    ) else (
        echo ERROR: package.json not found!
        set /a errors+=1
    )
) else (
    echo ERROR: Frontend folder not found!
    set /a errors+=1
)
echo.

echo [7/8] Checking Backend virtual environment...
if exist "backend\venv\" (
    echo OK: Virtual environment exists
) else (
    echo WARNING: Virtual environment not found
    echo It will be created on first run
)
echo.

echo [8/8] Checking Frontend node_modules...
if exist "frontend\node_modules\" (
    echo OK: Node.js packages installed
) else (
    echo WARNING: Node.js packages not installed
    echo They will be installed on first run
)
echo.

echo ========================================
echo Check Results
echo ========================================
if %errors% equ 0 (
    echo.
    echo SUCCESS: System is ready!
    echo.
    echo To start the system:
    echo    Double-click: start-system.bat
    echo.
) else (
    echo.
    echo ERROR: Found %errors% problem(s)
    echo Please fix them before running the system
    echo.
)
echo ========================================

echo.
echo Additional Information:
echo.
echo Current directory:
cd
echo.
echo Required ports:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5001
echo.
echo Default login:
echo    Admin:      admin / admin123
echo    Supervisor: supervisor / super123
echo    Employee:   employee / emp123
echo.

pause
