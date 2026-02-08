# دليل حل المشاكل - IntelliAttend

## 🔧 المشاكل الشائعة وحلولها

### 1. Backend لا يعمل

#### المشكلة:
```
Error: Connection refused to localhost:5001
```

#### الأسباب المحتملة:
1. Backend غير مشغل
2. المنفذ 5001 مستخدم من برنامج آخر
3. مشكلة في تثبيت المكتبات

#### الحل:
```bash
# 1. تأكد من تثبيت المكتبات
cd backend
pip install -r requirements/requirements.txt

# 2. شغل Backend
python enhanced_face_api_server.py

# يجب أن ترى:
# Starting Enhanced Face Recognition Server on port 5001...
# Loaded 10 encodings from Firebase
```

#### إذا استمرت المشكلة:
```bash
# تحقق من المنفذ
netstat -ano | findstr :5001

# إذا كان مستخدم، غير المنفذ في:
# backend/app/config/settings.py
PORT = 5002  # بدلاً من 5001
```

---

### 2. Firebase Connection Error

#### المشكلة:
```
Firebase initialization failed: Service account key file not found
```

#### السبب:
ملف مفتاح Firebase غير موجود أو في مكان خاطئ

#### الحل:
```bash
# 1. تأكد من وجود الملف:
user-login-data-7d185-firebase-adminsdk-fbsvc-3c8a31d30f.json

# 2. يجب أن يكون في المجلد الرئيسي للمشروع:
face-recognition-attendance-system/
  ├── backend/
  ├── frontend/
  └── user-login-data-7d185-firebase-adminsdk-fbsvc-3c8a31d30f.json

# 3. تحقق من المسار في الكود:
# backend/app/services/firebase_service.py
key_path = os.path.join(..., 'user-login-data-7d185-firebase-adminsdk-fbsvc-3c8a31d30f.json')
```

---

### 3. Face Recognition لا يعمل

#### المشكلة:
```
Error: No face detected
```

#### الأسباب:
1. الإضاءة سيئة
2. الوجه غير واضح
3. الكاميرا بعيدة جداً
4. زاوية الوجه غير مناسبة

#### الحل:
```
✓ تأكد من:
  - الإضاءة جيدة على الوجه
  - الوجه في منتصف الكاميرا
  - المسافة مناسبة (30-50 سم)
  - الوجه مستقيم (ليس جانبي)
  - لا توجد نظارات شمسية أو قناع
```

#### المشكلة:
```
Error: Multiple faces detected
```

#### الحل:
```
✓ تأكد من:
  - شخص واحد فقط أمام الكاميرا
  - لا توجد صور أو ملصقات وجوه في الخلفية
  - الخلفية نظيفة
```

---

### 4. Face Recognition يتعرف على الشخص الخطأ

#### المشكلة:
النظام يتعرف على "John" بدلاً من "Ahmed"

#### الأسباب:
1. صورة التدريب غير واضحة
2. تشابه كبير بين الوجهين
3. threshold عالي جداً

#### الحل:
```python
# 1. إعادة تدريب النموذج بصورة أفضل:
# - احذف الموظف
# - أضفه مرة أخرى بصورة واضحة

# 2. تقليل threshold في:
# ai/firebase_face_model.py
matches = face_recognition.compare_faces(
    self.known_face_encodings,
    face_encoding,
    tolerance=0.45  # كان 0.5، قللناه لدقة أعلى
)

# 3. زيادة minimum confidence:
if confidence < 0.50:  # كان 0.40، زدناه
    return None, "Confidence too low"
```

---

### 5. الكاميرا لا تفتح

#### المشكلة:
```
Camera access denied
```

#### الأسباب:
1. المتصفح لم يُعط إذن الكاميرا
2. الكاميرا مستخدمة من برنامج آخر
3. الكاميرا معطلة

#### الحل:
```
✓ في Chrome:
  1. اضغط على أيقونة القفل بجانب URL
  2. اختر "Site settings"
  3. في "Camera"، اختر "Allow"
  4. أعد تحميل الصفحة

✓ تأكد من:
  - إغلاق أي برنامج يستخدم الكاميرا (Zoom, Teams, etc.)
  - الكاميرا متصلة وتعمل
  - تجربة في متصفح آخر
```

---

### 6. Attendance Already Taken

#### المشكلة:
```
You have already marked attendance today
```

#### السبب:
المستخدم سجل حضوره اليوم

#### الحل (للاختبار فقط):
```typescript
// في Firebase Console:
// 1. افتح collection "attendance"
// 2. ابحث عن سجل اليوم للمستخدم
// 3. احذفه
// 4. حاول مرة أخرى

// أو استخدم هذا الكود للحذف:
const deleteAttendance = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const q = query(
    collection(db, 'attendance'),
    where('userId', '==', userId),
    where('date', '==', today)
  );
  const snapshot = await getDocs(q);
  snapshot.docs.forEach(doc => deleteDoc(doc.ref));
};
```

---

### 7. User Not Found in Firebase

#### المشكلة:
```
Step 2 Failed - User not found in Firebase
```

#### السبب:
الوجه تم التعرف عليه لكن المستخدم غير موجود في Firebase

#### الحل:
```bash
# 1. تحقق من Firebase Console:
# - افتح collection "users"
# - ابحث عن المستخدم بالاسم
# - تأكد من وجود حقل "numericId"

# 2. إذا لم يكن موجوداً، أضفه:
# - اذهب لـ /admin/add-employee
# - أضف الموظف مع صورته

# 3. أعد تحميل النموذج:
POST http://localhost:5001/retrain
```

---

### 8. Numeric ID Mismatch

#### المشكلة:
```
Step 2 Failed - Numeric ID mismatch
```

#### السبب:
الرقم الوظيفي المدخل لا يطابق المخزن في Firebase

#### الحل:
```typescript
// 1. تحقق من الرقم الصحيح:
// في Firebase Console → users → ابحث عن المستخدم
// انظر لحقل "numericId"

// 2. تأكد من إدخال الرقم الصحيح

// 3. إذا كان الرقم خاطئ في Firebase، عدله:
const updateNumericId = async (userId: string, newId: number) => {
  await updateDoc(doc(db, 'users', userId), {
    numericId: newId
  });
};
```

---

### 9. Frontend Build Errors

#### المشكلة:
```
Error: Module not found
```

#### الحل:
```bash
# 1. احذف node_modules و package-lock.json
cd frontend
rm -rf node_modules package-lock.json

# 2. أعد التثبيت
npm install

# 3. شغل المشروع
npm run dev
```

#### المشكلة:
```
Error: TypeScript compilation failed
```

#### الحل:
```bash
# 1. تحقق من إصدار TypeScript
npm list typescript

# 2. إذا كان قديم، حدثه
npm install typescript@latest

# 3. نظف cache
npm cache clean --force
```

---

### 10. Slow Face Recognition

#### المشكلة:
التعرف على الوجه يأخذ وقت طويل (> 5 ثواني)

#### الأسباب:
1. عدد كبير من الموظفين في قاعدة البيانات
2. الصورة كبيرة جداً
3. استخدام model='large'

#### الحل:
```python
# 1. تقليل حجم الصورة:
# في backend/app/utils/image_utils.py
def resize_image(image, max_width=800):
    if image.width > max_width:
        ratio = max_width / image.width
        new_height = int(image.height * ratio)
        return image.resize((max_width, new_height))
    return image

# 2. استخدام model='small' للسرعة:
# في ai/firebase_face_model.py
face_encodings = face_recognition.face_encodings(
    image_array,
    model='small'  # أسرع لكن أقل دقة
)

# 3. استخدام caching:
# النظام يستخدم encoding_cache بالفعل
```

---

### 11. Memory Issues

#### المشكلة:
```
MemoryError: Unable to allocate array
```

#### السبب:
عدد كبير جداً من encodings في الذاكرة

#### الحل:
```python
# 1. تنظيف cache بشكل دوري:
POST http://localhost:5001/clear-cache

# 2. إعادة تشغيل Backend:
# اضغط Ctrl+C ثم شغله مرة أخرى

# 3. زيادة memory limit:
# في enhanced_face_api_server.py
import resource
resource.setrlimit(resource.RLIMIT_AS, (4 * 1024**3, -1))  # 4GB
```

---

### 12. CORS Errors

#### المشكلة:
```
Access to fetch blocked by CORS policy
```

#### السبب:
Backend لا يسمح بطلبات من Frontend

#### الحل:
```python
# في backend/app/config/settings.py
CORS_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]

# تأكد من تثبيت flask-cors:
pip install flask-cors

# في server_factory.py:
from flask_cors import CORS
CORS(app, origins=Config.CORS_ORIGINS)
```

---

### 13. Session Expired

#### المشكلة:
المستخدم يُحول لصفحة login فجأة

#### السبب:
sessionStorage تم مسحها

#### الحل:
```typescript
// استخدم localStorage بدلاً من sessionStorage:
// في useAuth hook:
const saveUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
  // بدلاً من sessionStorage
};

const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
```

---

### 14. Image Upload Failed

#### المشكلة:
```
Error: Image too large
```

#### الحل:
```typescript
// ضغط الصورة قبل الرفع:
const compressImage = (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const scale = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};
```

---

### 15. Database Query Slow

#### المشكلة:
جلب البيانات من Firebase بطيء

#### الحل:
```typescript
// 1. إضافة indexes في Firebase Console:
// Collection: attendance
// Fields: userId (Ascending), date (Descending)

// 2. استخدام pagination:
const getAttendancePaginated = async (limit = 50) => {
  const q = query(
    collection(db, 'attendance'),
    orderBy('date', 'desc'),
    limit(limit)
  );
  return await getDocs(q);
};

// 3. استخدام caching:
let cachedUsers: User[] | null = null;
export const getUsersCached = async (): Promise<User[]> => {
  if (cachedUsers) return cachedUsers;
  cachedUsers = await getUsers();
  return cachedUsers;
};
```

---

## 🐛 Debug Tips

### 1. تفعيل Console Logs

```typescript
// في Frontend:
console.log('User:', user);
console.log('Captured image:', imageData.substring(0, 50));
console.log('Verification result:', result);

// في Backend:
print(f"Received image size: {len(image_data)}")
print(f"Recognized: {recognized_name}")
print(f"Confidence: {confidence}")
```

### 2. استخدام Network Tab

```
1. افتح Chrome DevTools (F12)
2. اذهب لـ Network tab
3. سجل حضور
4. انظر للطلبات:
   - POST /three-step-verify
   - Status: 200 OK
   - Response: {...}
```

### 3. فحص Firebase

```
1. افتح Firebase Console
2. اذهب لـ Firestore Database
3. تحقق من:
   - users collection
   - attendance collection
   - البيانات صحيحة
```

### 4. اختبار Backend مباشرة

```bash
# استخدم Postman أو curl:
curl -X POST http://localhost:5001/three-step-verify \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,...",
    "expected_numeric_id": 5
  }'
```

---

## 📞 الحصول على المساعدة

إذا استمرت المشكلة:

1. **تحقق من Logs:**
   - Backend: في terminal حيث يعمل Python
   - Frontend: في Browser Console (F12)

2. **أعد تشغيل كل شيء:**
   ```bash
   # Backend
   Ctrl+C
   python enhanced_face_api_server.py
   
   # Frontend
   Ctrl+C
   npm run dev
   ```

3. **تحقق من الإصدارات:**
   ```bash
   python --version  # يجب أن يكون 3.8+
   node --version    # يجب أن يكون 18+
   ```

4. **راجع الملفات:**
   - PROJECT_EXPLANATION_AR.md
   - DATA_FLOW_AR.md
   - CODE_EXPLANATION_AR.md

---

هذا دليل شامل لحل المشاكل الشائعة!
