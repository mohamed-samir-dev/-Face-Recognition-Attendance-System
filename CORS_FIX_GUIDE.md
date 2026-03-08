# حل مشكلة CORS - خطوات سريعة

## المشكلة:
```
Access to fetch at 'https://web-production-2f98c.up.railway.app/generate-encoding' 
from origin 'https://face-recognition-attendance-system-nine-chi.vercel.app' 
has been blocked by CORS policy
```

## الحل:

### 1. تحديث متغيرات البيئة على Railway

اذهب إلى Railway Dashboard → Variables وأضف:

```
CORS_ORIGINS=http://localhost:3000,https://face-recognition-attendance-system-nine-chi.vercel.app
```

### 2. إعادة نشر Frontend على Vercel

بعد تحديث `.env.production`، قم بـ:

```bash
cd frontend
git add .
git commit -m "Fix: Update production API URLs to Railway"
git push
```

Vercel سيقوم بإعادة النشر تلقائياً.

### 3. إعادة نشر Backend على Railway

```bash
git add .
git commit -m "Fix: Update CORS settings for Vercel"
git push
```

Railway سيقوم بإعادة النشر تلقائياً.

### 4. التحقق من الإصلاح

افتح Console في المتصفح وتحقق من:
- ✓ لا توجد أخطاء CORS
- ✓ الطلبات تصل إلى Railway بنجاح
- ✓ الاستجابات تعود بشكل صحيح

## ملاحظات مهمة:

1. **Railway Environment Variables**: تأكد من إضافة `CORS_ORIGINS` في Railway
2. **Vercel Redeploy**: بعد تحديث `.env.production`، يجب إعادة النشر
3. **Cache**: قد تحتاج لمسح cache المتصفح (Ctrl+Shift+Delete)
4. **Testing**: اختبر من Incognito/Private window للتأكد

## إذا استمرت المشكلة:

تحقق من:
- [ ] Railway logs: هل الـ server يعمل؟
- [ ] Vercel logs: هل الـ build نجح؟
- [ ] Network tab: ما هو الـ URL الفعلي للطلبات؟
- [ ] Railway Variables: هل `CORS_ORIGINS` موجود؟

## الملفات المعدلة:

1. `backend/app/config/settings.py` - إعدادات CORS
2. `backend/app/server_factory.py` - تطبيق CORS
3. `frontend/.env.production` - Railway URLs
