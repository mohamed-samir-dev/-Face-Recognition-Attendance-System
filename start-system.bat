@echo off
echo ========================================
echo Starting IntelliAttend System
echo ========================================
echo.

echo [1/4] Checking requirements...
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Python not installed!
    pause
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js not installed!
    pause
    exit /b 1
)

echo OK: Python and Node.js found
echo.

echo [2/4] Starting Backend Server...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Backend ready!
start "Backend Server" cmd /k "cd /d "%cd%" && venv\Scripts\activate.bat && python enhanced_face_api_server.py"
cd ..
echo.

timeout /t 3 /nobreak >nul

echo [3/4] Starting Frontend Server...
cd frontend
if not exist node_modules (
    echo Installing Node.js packages...
    call npm install
)

echo Frontend ready!
start "Frontend Server" cmd /k "cd /d "%cd%" && npm run dev"
cd ..
echo.

timeout /t 5 /nobreak >nul

echo [4/4] Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo System is running!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5001
echo.
echo Login credentials:
echo    Admin: admin / admin123
echo    Supervisor: supervisor / super123
echo    Employee: employee / emp123
echo.
echo Do NOT close Terminal windows!
echo To stop: Press Ctrl+C in each window
echo.
echo ========================================
pause
