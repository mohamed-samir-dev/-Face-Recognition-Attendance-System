@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 تشغيل نظام IntelliAttend
echo ========================================
echo.

echo [1/4] التحقق من المتطلبات...
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python غير مثبت! يرجى تثبيت Python 3.8+ أولاً
    pause
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت! يرجى تثبيت Node.js 18+ أولاً
    pause
    exit /b 1
)

echo ✅ Python و Node.js موجودان
echo.

echo [2/4] تشغيل Backend Server...
cd backend
if not exist venv (
    echo 📦 إنشاء البيئة الافتراضية...
    python -m venv venv
)

echo 📦 تفعيل البيئة الافتراضية...
call venv\Scripts\activate.bat

echo 📦 تثبيت المكتبات (إذا لزم الأمر)...
pip install -q -r requirements/requirements.txt
pip install -q -r requirements/requirements_face.txt
pip install -q -r requirements/requirements_firebase.txt

echo ✅ Backend جاهز للتشغيل
start "Backend Server" cmd /k "cd /d "%cd%" && venv\Scripts\activate.bat && python enhanced_face_api_server.py"
cd ..
echo.

timeout /t 3 /nobreak >nul

echo [3/4] تشغيل Frontend Server...
cd frontend
if not exist node_modules (
    echo 📦 تثبيت مكتبات Node.js...
    call npm install
)

echo ✅ Frontend جاهز للتشغيل
start "Frontend Server" cmd /k "cd /d "%cd%" && npm run dev"
cd ..
echo.

timeout /t 5 /nobreak >nul

echo [4/4] فتح المتصفح...
start http://localhost:3000

echo.
echo ========================================
echo ✅ النظام يعمل الآن!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5001
echo.
echo 📝 بيانات الدخول الافتراضية:
echo    Admin: admin / admin123
echo    Supervisor: supervisor / super123
echo    Employee: employee / emp123
echo.
echo ⚠️  لا تغلق هذه النافذة أو نوافذ الـ Terminal الأخرى
echo    لإيقاف السيرفرات: اضغط Ctrl+C في كل نافذة
echo.
echo ========================================
pause
