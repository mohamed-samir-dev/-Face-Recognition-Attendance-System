# ✅ Railway Deployment Checklist

## 📦 الملفات الجاهزة:

- [x] `.railwayignore` - ملفات لا تُرفع
- [x] `Procfile` - أمر التشغيل
- [x] `runtime.txt` - Python 3.11
- [x] `nixpacks.toml` - إعدادات Build
- [x] `railway.json` - إعدادات Railway
- [x] `requirements.txt` - المكتبات المطلوبة
- [x] `.gitignore` - حماية Firebase
- [x] `settings.py` - دعم Environment Variables
- [x] `firebase_service.py` - دعم Railway

---

## 🚀 الخطوات التالية:

### 1. رفع على GitHub
```bash
git init
git add .
git commit -m "Ready for Railway deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/intelliattend-backend.git
git push -u origin main
```

### 2. Deploy على Railway
1. اذهب إلى: https://railway.app/
2. سجّل دخول بـ GitHub
3. Deploy from GitHub repo
4. اختر Repository
5. Deploy Now

### 3. إضافة Environment Variables

في Railway Dashboard → Variables:

```bash
# Required
FIREBASE_CREDENTIALS_JSON=[محتوى ملف Firebase JSON كامل]
CORS_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3000

# Optional
FLASK_ENV=production
PORT=5001
FACE_THRESHOLD=0.5
```

### 4. Generate Domain
Settings → Generate Domain → احفظ الـ URL

### 5. تحديث Vercel
```bash
NEXT_PUBLIC_FACE_RECOGNITION_URL=https://your-app.up.railway.app
NEXT_PUBLIC_FACE_DETECTION_URL=https://your-app.up.railway.app
```

### 6. اختبار
```
https://your-app.up.railway.app/health
```

---

## 📚 الأدلة الكاملة:

- **دليل سريع:** `RAILWAY_QUICK_START.md`
- **دليل كامل:** `RAILWAY_DEPLOYMENT.md`

---

## 🆘 مشاكل؟

### Build Failed
```bash
# شوف الـ Logs في Railway Dashboard
# تأكد من requirements.txt
# تأكد من runtime.txt
```

### Firebase Error
```bash
# تأكد من FIREBASE_CREDENTIALS_JSON
# تأكد إن الـ JSON صحيح (بدون أخطاء)
# تأكد من الأقواس والفواصل
```

### CORS Error
```bash
# تأكد من CORS_ORIGINS في Variables
# تأكد من رابط Vercel صحيح
# أعد Deploy
```

---

## 💡 نصائح:

1. ✅ Railway يعمل Auto-deploy عند كل Push
2. ✅ Free Plan: 500 ساعة/شهر
3. ✅ HTTPS مجاني تلقائياً
4. ✅ شوف الـ Logs في Dashboard

---

**🎉 جاهز للرفع! اتبع الخطوات في `RAILWAY_QUICK_START.md`**
