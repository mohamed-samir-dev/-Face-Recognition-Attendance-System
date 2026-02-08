@echo off
chcp 65001 >nul
echo ========================================
echo 🔍 فحص جاهزية نظام IntelliAttend
echo ========================================
echo.

set "errors=0"

echo [1/8] فحص Python...
where python >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do set pyver=%%i
    echo ✅ Python مثبت - الإصدار: %pyver%
) else (
    echo ❌ Python غير مثبت!
    echo    قم بتثبيت Python 3.8+ من: https://www.python.org/downloads/
    set /a errors+=1
)
echo.

echo [2/8] فحص Node.js...
where node >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set nodever=%%i
    echo ✅ Node.js مثبت - الإصدار: %nodever%
) else (
    echo ❌ Node.js غير مثبت!
    echo    قم بتثبيت Node.js 18+ من: https://nodejs.org/
    set /a errors+=1
)
echo.

echo [3/8] فحص npm...
where npm >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set npmver=%%i
    echo ✅ npm مثبت - الإصدار: %npmver%
) else (
    echo ❌ npm غير مثبت!
    set /a errors+=1
)
echo.

echo [4/8] فحص ملف Firebase...
if exist "user-login-data-7d185-firebase-adminsdk-fbsvc-3c8a31d30f.json" (
    echo ✅ ملف Firebase موجود
) else (
    echo ❌ ملف Firebase غير موجود!
    echo    تأكد من وجود ملف: user-login-data-*.json
    set /a errors+=1
)
echo.

echo [5/8] فحص مجلد Backend...
if exist "backend\" (
    echo ✅ مجلد Backend موجود
    if exist "backend\enhanced_face_api_server.py" (
        echo ✅ ملف السيرفر موجود
    ) else (
        echo ❌ ملف السيرفر غير موجود!
        set /a errors+=1
    )
) else (
    echo ❌ مجلد Backend غير موجود!
    set /a errors+=1
)
echo.

echo [6/8] فحص مجلد Frontend...
if exist "frontend\" (
    echo ✅ مجلد Frontend موجود
    if exist "frontend\package.json" (
        echo ✅ ملف package.json موجود
    ) else (
        echo ❌ ملف package.json غير موجود!
        set /a errors+=1
    )
) else (
    echo ❌ مجلد Frontend غير موجود!
    set /a errors+=1
)
echo.

echo [7/8] فحص البيئة الافتراضية للـ Backend...
if exist "backend\venv\" (
    echo ✅ البيئة الافتراضية موجودة
) else (
    echo ⚠️  البيئة الافتراضية غير موجودة
    echo    سيتم إنشاؤها عند التشغيل
)
echo.

echo [8/8] فحص مكتبات Frontend...
if exist "frontend\node_modules\" (
    echo ✅ مكتبات Node.js مثبتة
) else (
    echo ⚠️  مكتبات Node.js غير مثبتة
    echo    سيتم تثبيتها عند التشغيل
)
echo.

echo ========================================
echo 📊 نتيجة الفحص
echo ========================================
if %errors% equ 0 (
    echo.
    echo ✅ النظام جاهز للتشغيل!
    echo.
    echo 🚀 لتشغيل النظام:
    echo    1. اضغط دبل كليك على: تشغيل_النظام.bat
    echo    أو
    echo    2. راجع ملف: ابدأ_هنا.md
    echo.
) else (
    echo.
    echo ❌ يوجد %errors% مشكلة يجب حلها
    echo.
    echo 📚 للمساعدة:
    echo    - راجع ملف: دليل_التشغيل.md
    echo    - راجع ملف: حل_المشاكل.md
    echo.
)
echo ========================================

echo.
echo 📋 معلومات إضافية:
echo.
echo 📁 المجلد الحالي:
cd
echo.
echo 🌐 المنافذ المطلوبة:
echo    - Frontend: http://localhost:3000
echo    - Backend:  http://localhost:5001
echo.
echo 👤 بيانات الدخول الافتراضية:
echo    - Admin:      admin / admin123
echo    - Supervisor: supervisor / super123
echo    - Employee:   employee / emp123
echo.

pause
