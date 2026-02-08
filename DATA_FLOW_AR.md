# تدفق البيانات التفصيلي - IntelliAttend

## 🔄 تدفق البيانات في عملية تسجيل الحضور

### المرحلة 1: فتح صفحة الكاميرا

```
المستخدم يضغط "Mark Attendance"
↓
Frontend: router.push('/camera?mode=checkin')
↓
CameraPageContent Component يتم تحميله
↓
useEffect يتحقق من:
  1. هل المستخدم مسجل دخول؟
     - إذا لا → redirect('/login')
  2. هل المستخدم في إجازة؟
     - إذا نعم → عرض رسالة "You are on leave"
  3. هل سجل حضوره اليوم؟
     - checkDailyAttendance(userId)
     - إذا نعم → redirect('/userData?showAttendanceWarning=true')
↓
إذا كل شيء OK → عرض CameraContainer
```

### المرحلة 2: التقاط الصورة

```
المستخدم يضغط "Start Camera"
↓
useCamera Hook:
  navigator.mediaDevices.getUserMedia({
    video: { 
      width: 1280, 
      height: 720,
      facingMode: 'user'
    }
  })
↓
الكاميرا تفتح وتعرض live feed
↓
المستخدم يضغط "Capture"
↓
const canvas = document.createElement('canvas')
canvas.width = video.videoWidth
canvas.height = video.videoHeight
const ctx = canvas.getContext('2d')
ctx.drawImage(video, 0, 0)
const imageData = canvas.toDataURL('image/jpeg', 0.95)
↓
imageData الآن يحتوي على الصورة بصيغة base64:
"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
```

### المرحلة 3: إرسال للـ Backend

```
Frontend يستدعي:
performThreeStepAuthentication(imageData, user)
↓
fetch('http://localhost:5001/three-step-verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image: imageData,
    expected_numeric_id: user.numericId
  })
})
↓
الطلب يصل للـ Backend (Flask Server)
```

### المرحلة 4: معالجة في Backend

```
Flask يستقبل الطلب في face_routes.py
↓
@app.route('/three-step-verify', methods=['POST'])
def three_step_verify():
↓
1. استخراج البيانات:
   data = request.get_json()
   image_data = data['image'].split(',')[1]  # إزالة "data:image/jpeg;base64,"
   expected_numeric_id = data['expected_numeric_id']
↓
2. تحويل base64 إلى ملف:
   image_bytes = base64.b64decode(image_data)
   temp_file.write(image_bytes)
↓
3. استدعاء نموذج التعرف:
   recognized_name, message = face_model.recognize_face(temp_path)
```

### المرحلة 5: التعرف على الوجه (AI Processing)

```
face_model.recognize_face(image_path)
↓
1. تحميل الصورة:
   image = face_recognition.load_image_file(image_path)
   # الصورة الآن مصفوفة NumPy: shape (720, 1280, 3)
↓
2. اكتشاف الوجه:
   face_locations = face_recognition.face_locations(image)
   # يرجع: [(top, right, bottom, left), ...]
↓
3. استخراج face encoding:
   face_encodings = face_recognition.face_encodings(image, model='large')
   # يرجع: array من 128 رقم عشري
   # مثال: [0.123, -0.456, 0.789, ..., 0.321]
↓
4. المقارنة مع قاعدة البيانات:
   for i, known_encoding in enumerate(self.known_face_encodings):
       distance = face_recognition.face_distance([known_encoding], face_encoding)[0]
       # distance = المسافة الإقليدية بين vectors
       # كلما قلت المسافة، كلما زاد التشابه
↓
5. إيجاد أفضل تطابق:
   best_match_index = np.argmin(face_distances)
   if face_distances[best_match_index] < 0.5:  # threshold
       name = self.known_face_names[best_match_index]
       confidence = 1 - face_distances[best_match_index]
       return name, f"Recognized: {name} ({confidence:.0%})"
```

### المرحلة 6: التحقق من الرقم الوظيفي

```
Backend يتحقق من Firebase:
↓
users_ref = firebase_service.db.collection('users')
query = users_ref.where('name', '==', recognized_name)
docs = query.get()
↓
firebase_user = docs[0].to_dict()
firebase_numeric_id = firebase_user.get('numericId')
↓
if firebase_numeric_id == expected_numeric_id:
    verification_result['step2_numeric_id_verification'] = {
        'success': True,
        'message': 'IDs match'
    }
    verification_result['overall_success'] = True
```

### المرحلة 7: إرجاع النتيجة

```
Backend يرجع JSON:
{
  "step1_face_recognition": {
    "success": true,
    "recognized_name": "John Doe",
    "message": "Recognized: John Doe (95%)"
  },
  "step2_numeric_id_verification": {
    "success": true,
    "firebase_numeric_id": 5,
    "expected_numeric_id": 5,
    "message": "IDs match"
  },
  "overall_success": true,
  "message": "Authentication successful for John Doe"
}
```

### المرحلة 8: حفظ الحضور في Firebase

```
Frontend يستقبل النتيجة:
if (result.overall_success) {
↓
  markAttendance(user.id, user.name)
↓
  const attendanceData = {
    userId: user.id,
    employeeName: user.name,
    date: new Date().toISOString().split('T')[0],
    checkIn: new Date().toLocaleTimeString('en-US', { hour12: false }),
    status: isLate ? 'Late' : 'Present',
    timestamp: serverTimestamp()
  }
↓
  await addDoc(collection(db, 'attendance'), attendanceData)
↓
  عرض رسالة نجاح
  redirect('/userData')
}
```

---

## 📝 تدفق البيانات في إضافة موظف جديد

### الخطوة 1: ملء النموذج

```
Admin في صفحة /admin/add-employee
↓
يملأ النموذج:
- name: "Ahmed Ali"
- email: "ahmed@company.com"
- department: "IT"
- jobTitle: "Developer"
- يرفع صورة
↓
const handleImageUpload = (e) => {
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onloadend = () => {
    setFormData({...formData, image: reader.result})
  }
  reader.readAsDataURL(file)
}
```

### الخطوة 2: توليد البيانات التلقائية

```
عند الضغط على Submit:
↓
1. توليد username:
   const username = name.toLowerCase().replace(/\s+/g, '.')
   // "Ahmed Ali" → "ahmed.ali"
↓
2. توليد password عشوائي:
   const password = Math.random().toString(36).slice(-8)
   // مثال: "x7k9m2p4"
↓
3. الحصول على رقم وظيفي جديد:
   const numericId = await getNextUserId()
   // يجلب آخر رقم من Firebase ويضيف 1
```

### الخطوة 3: حفظ في Firebase

```
createUserWithId(userData)
↓
const documentId = `user_${numericId.toString().padStart(4, '0')}_${username}`
// مثال: "user_0015_ahmed.ali"
↓
const newUser = {
  id: documentId,
  numericId: 15,
  name: "Ahmed Ali",
  username: "ahmed.ali",
  password: "x7k9m2p4",
  email: "ahmed@company.com",
  department: "IT",
  jobTitle: "Developer",
  image: "data:image/jpeg;base64,...",
  accountType: "Employee",
  status: "Active"
}
↓
await setDoc(doc(db, "users", documentId), newUser)
```

### الخطوة 4: توليد Face Encoding

```
Frontend يرسل للـ Backend:
↓
fetch('http://localhost:5001/add-employee', {
  method: 'POST',
  body: JSON.stringify({
    name: "Ahmed Ali",
    numericId: 15,
    image: "data:image/jpeg;base64,..."
  })
})
↓
Backend يستقبل:
↓
face_model.add_employee(name, numeric_id, image_base64)
↓
1. توليد encoding:
   encoding, message = generate_encoding_from_base64(image_base64)
↓
2. حفظ في Firebase:
   users_ref.where('numericId', '==', numeric_id).limit(1)
   existing[0].reference.update({'faceEncoding': encoding.tolist()})
↓
3. إضافة للنموذج في الذاكرة:
   self.known_face_encodings.append(encoding)
   self.known_face_names.append(name)
   self.known_face_ids.append(numeric_id)
```

### الخطوة 5: إرسال Email

```
Frontend يستدعي API:
↓
fetch('/api/send-credentials', {
  method: 'POST',
  body: JSON.stringify({
    email: "ahmed@company.com",
    name: "Ahmed Ali",
    username: "ahmed.ali",
    password: "x7k9m2p4"
  })
})
↓
Next.js API Route:
↓
import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({...})
await transporter.sendMail({
  to: email,
  subject: "Welcome to IntelliAttend",
  html: `
    <h1>Welcome ${name}!</h1>
    <p>Username: ${username}</p>
    <p>Password: ${password}</p>
  `
})
```

---

## 🔍 كيف يعمل Face Recognition بالتفصيل

### 1. تحويل الصورة إلى Face Encoding

```
الصورة الأصلية (1280x720 pixels)
↓
[Step 1] تحويل إلى RGB array
  image_array = np.array(image)
  shape: (720, 1280, 3)
  # 3 = RGB channels
↓
[Step 2] اكتشاف الوجه (Face Detection)
  dlib يستخدم HOG (Histogram of Oriented Gradients)
  يجد مستطيل حول الوجه: (top, right, bottom, left)
↓
[Step 3] استخراج Face Landmarks
  dlib يجد 68 نقطة على الوجه:
  - 17 نقطة للحاجبين
  - 5 نقاط للأنف
  - 12 نقطة للعينين
  - 20 نقطة للفم
  - 14 نقطة لحدود الوجه
↓
[Step 4] تطبيع الوجه (Face Alignment)
  يدور ويقص الوجه ليكون مستقيماً
↓
[Step 5] استخراج Features
  ResNet-34 neural network يحول الوجه إلى 128 رقم
  هذه الأرقام تمثل خصائص الوجه:
  - شكل العينين
  - المسافة بين العينين
  - شكل الأنف
  - شكل الفم
  - ملامح الوجه العامة
↓
النتيجة: Face Encoding
  array([0.123, -0.456, 0.789, ..., 0.321])
  128 رقم عشري
```

### 2. مقارنة الوجوه

```
لدينا:
- face_encoding_1: الوجه الملتقط الآن
- face_encoding_2: الوجه المخزن في قاعدة البيانات
↓
حساب المسافة الإقليدية (Euclidean Distance):
distance = sqrt(sum((face_encoding_1[i] - face_encoding_2[i])^2))
↓
مثال:
face_encoding_1 = [0.1, 0.2, 0.3, ...]
face_encoding_2 = [0.15, 0.18, 0.32, ...]
↓
distance = sqrt((0.1-0.15)^2 + (0.2-0.18)^2 + (0.3-0.32)^2 + ...)
distance = 0.35
↓
if distance < 0.5:  # threshold
    print("Same person!")
    confidence = (1 - distance) * 100
    # confidence = 65%
else:
    print("Different person!")
```

---

## 💾 هيكل البيانات في Firebase

### users Collection

```javascript
users/
  ├── user_0001_admin/
  │   ├── id: "user_0001_admin"
  │   ├── numericId: 1
  │   ├── name: "Admin"
  │   ├── username: "admin"
  │   ├── password: "admin123"
  │   ├── accountType: "Admin"
  │   ├── image: "data:image/jpeg;base64,..."
  │   └── faceEncoding: [0.123, -0.456, ..., 0.321]
  │
  ├── user_0002_john.doe/
  │   ├── id: "user_0002_john.doe"
  │   ├── numericId: 2
  │   ├── name: "John Doe"
  │   ├── username: "john.doe"
  │   ├── email: "john@company.com"
  │   ├── department: "IT"
  │   ├── jobTitle: "Developer"
  │   ├── accountType: "Employee"
  │   ├── status: "Active"
  │   ├── salary: 5000
  │   ├── image: "data:image/jpeg;base64,..."
  │   └── faceEncoding: [0.234, -0.567, ..., 0.432]
  │
  └── user_0003_jane.smith/
      └── ...
```

### attendance Collection

```javascript
attendance/
  ├── att_20240115_001/
  │   ├── id: "att_20240115_001"
  │   ├── userId: "user_0002_john.doe"
  │   ├── employeeName: "John Doe"
  │   ├── date: "2024-01-15"
  │   ├── checkIn: "09:00:00"
  │   ├── checkOut: "17:30:00"
  │   ├── status: "Present"
  │   ├── workedHours: 8.5
  │   ├── overtimeHours: 0.5
  │   └── timestamp: Timestamp(2024-01-15 09:00:00)
  │
  ├── att_20240115_002/
  │   ├── userId: "user_0003_jane.smith"
  │   ├── date: "2024-01-15"
  │   ├── checkIn: "09:15:00"
  │   ├── status: "Late"
  │   └── ...
  │
  └── att_20240116_001/
      └── ...
```

---

هذا شرح تفصيلي لتدفق البيانات في النظام!
