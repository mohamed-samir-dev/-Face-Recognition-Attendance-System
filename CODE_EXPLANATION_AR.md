# شرح الأكواد المهمة - IntelliAttend

## 🐍 Backend Code Explanation

### 1. FirebaseFaceModel Class

```python
class FirebaseFaceModel:
    def __init__(self):
        # قوائم لتخزين بيانات الموظفين في الذاكرة
        self.known_face_encodings = []  # قائمة encodings (128 رقم لكل وجه)
        self.known_face_names = []      # قائمة أسماء الموظفين
        self.known_face_ids = []        # قائمة الأرقام الوظيفية
        self.firebase_service = FirebaseService()  # اتصال Firebase
```

**لماذا نخزن في الذاكرة؟**
- للسرعة: المقارنة في الذاكرة أسرع من قراءة Firebase كل مرة
- للكفاءة: نحمل البيانات مرة واحدة عند بدء الخادم

---

### 2. load_from_firebase Method

```python
def load_from_firebase(self):
    """يحمل جميع encodings من Firebase"""
    
    # 1. الاتصال بـ collection users
    users_ref = self.firebase_service.db.collection('users')
    docs = users_ref.stream()  # جلب جميع المستندات
    
    # 2. المرور على كل مستخدم
    for doc in docs:
        user_data = doc.to_dict()  # تحويل المستند إلى dictionary
        
        # 3. استخراج البيانات
        name = user_data.get('name')
        user_id = user_data.get('numericId')
        encoding_data = user_data.get('faceEncoding')
        
        # 4. إذا كان لديه encoding، نضيفه للقوائم
        if encoding_data and name:
            encoding = np.array(encoding_data)  # تحويل list إلى NumPy array
            self.known_face_encodings.append(encoding)
            self.known_face_names.append(name)
            self.known_face_ids.append(user_id)
    
    return count > 0
```

**مثال على البيانات:**
```python
# بعد التحميل، القوائم تبدو هكذا:
known_face_encodings = [
    array([0.123, -0.456, ..., 0.321]),  # John's encoding
    array([0.234, -0.567, ..., 0.432]),  # Jane's encoding
    array([0.345, -0.678, ..., 0.543])   # Ahmed's encoding
]
known_face_names = ["John Doe", "Jane Smith", "Ahmed Ali"]
known_face_ids = [2, 3, 4]
```

---

### 3. recognize_face Method

```python
def recognize_face(self, image_path):
    """يتعرف على الوجه من صورة"""
    
    # 1. تحميل الصورة
    image = face_recognition.load_image_file(image_path)
    # الصورة الآن: NumPy array بحجم (height, width, 3)
    
    # 2. استخراج face encodings من الصورة
    face_encodings = face_recognition.face_encodings(image, model='large')
    # model='large' يعطي دقة أعلى لكن أبطأ
    
    # 3. التحقق من عدد الوجوه
    if not face_encodings:
        return None, "No face detected"
    if len(face_encodings) > 1:
        return None, "Multiple faces detected"
    
    # 4. الحصول على encoding الوجه الوحيد
    face_encoding = face_encodings[0]
    
    # 5. حساب المسافة بين الوجه الجديد وجميع الوجوه المخزنة
    face_distances = face_recognition.face_distance(
        self.known_face_encodings,  # جميع encodings المخزنة
        face_encoding               # encoding الوجه الجديد
    )
    # النتيجة: array([0.35, 0.82, 0.91, ...])
    # كل رقم يمثل المسافة بين الوجه الجديد ووجه مخزن
    
    # 6. المقارنة مع threshold
    matches = face_recognition.compare_faces(
        self.known_face_encodings,
        face_encoding,
        tolerance=0.5  # إذا المسافة < 0.5 يعتبر تطابق
    )
    # النتيجة: [True, False, False, ...]
    
    # 7. إيجاد أفضل تطابق
    best_match_index = np.argmin(face_distances)
    # يرجع index الوجه الأقرب
    
    # 8. التحقق من التطابق
    if matches[best_match_index]:
        name = self.known_face_names[best_match_index]
        confidence = 1 - face_distances[best_match_index]
        
        # 9. التحقق من الثقة
        if confidence < 0.40:  # 40% minimum confidence
            return None, f"Confidence too low ({confidence:.0%})"
        
        return name, f"Recognized: {name} ({confidence:.0%})"
    
    return None, "No match found"
```

**مثال عملي:**
```python
# لنفترض:
face_distances = [0.35, 0.82, 0.91]  # المسافات
known_face_names = ["John", "Jane", "Ahmed"]

# أقل مسافة = 0.35 (index 0)
best_match_index = 0
name = "John"
confidence = 1 - 0.35 = 0.65 = 65%

# النتيجة: "Recognized: John (65%)"
```

---

### 4. three_step_verify Endpoint

```python
@app.route('/three-step-verify', methods=['POST'])
def three_step_verify():
    # 1. استقبال البيانات
    data = request.get_json()
    image_data = data['image'].split(',')[1]  # إزالة "data:image/jpeg;base64,"
    expected_numeric_id = data['expected_numeric_id']
    
    # 2. تحويل base64 إلى bytes
    image_bytes = base64.b64decode(image_data)
    
    # 3. حفظ في ملف مؤقت
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
        temp_file.write(image_bytes)
        temp_path = temp_file.name
    
    try:
        # 4. التعرف على الوجه
        recognized_name, message = face_model.recognize_face(temp_path)
        
        # 5. إنشاء نتيجة التحقق
        verification_result = {
            'step1_face_recognition': {
                'success': bool(recognized_name),
                'recognized_name': recognized_name,
                'message': message
            },
            'step2_numeric_id_verification': {'success': False},
            'overall_success': False
        }
        
        # 6. إذا فشل التعرف، نرجع مباشرة
        if not recognized_name:
            return jsonify(verification_result)
        
        # 7. التحقق من Firebase
        users_ref = firebase_service.db.collection('users')
        query = users_ref.where('name', '==', recognized_name)
        docs = query.get()
        
        firebase_user = docs[0].to_dict()
        firebase_numeric_id = firebase_user.get('numericId')
        
        # 8. مقارنة الأرقام
        numeric_id_match = (firebase_numeric_id == expected_numeric_id)
        
        # 9. تحديث النتيجة
        verification_result['step2_numeric_id_verification'] = {
            'success': numeric_id_match,
            'firebase_numeric_id': firebase_numeric_id,
            'expected_numeric_id': expected_numeric_id
        }
        
        if numeric_id_match:
            verification_result['overall_success'] = True
        
        return jsonify(verification_result)
        
    finally:
        # 10. حذف الملف المؤقت
        os.unlink(temp_path)
```

---

## ⚛️ Frontend Code Explanation

### 1. useCamera Hook

```typescript
export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      // 1. طلب إذن الوصول للكاميرا
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'  // الكاميرا الأمامية
        }
      });
      
      // 2. ربط stream بعنصر video
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
    } catch (err) {
      setError('Camera access denied');
    }
  };

  const captureImage = (): string | null => {
    if (!videoRef.current) return null;
    
    // 1. إنشاء canvas
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    // 2. رسم الصورة من video إلى canvas
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);
    
    // 3. تحويل canvas إلى base64
    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const stopCamera = () => {
    // إيقاف جميع tracks
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  return { videoRef, startCamera, captureImage, stopCamera, error };
};
```

**كيف يعمل؟**
```
1. startCamera() يطلب إذن الكاميرا
2. المتصفح يعرض نافذة "Allow camera access?"
3. إذا وافق المستخدم، يحصل على MediaStream
4. MediaStream يُربط بعنصر <video>
5. الفيديو يظهر مباشرة على الشاشة
6. عند الضغط على Capture، يُرسم frame واحد على canvas
7. Canvas يُحول إلى base64 string
```

---

### 2. performThreeStepAuthentication Function

```typescript
export async function performThreeStepAuthentication(
  capturedImageData: string,
  user: User
): Promise<ThreeStepVerificationResult> {
  
  console.log(`Starting authentication for ${user.name}`);
  
  // 1. إرسال الطلب للـ Backend
  const response = await fetch("http://localhost:5001/three-step-verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: capturedImageData,  // "data:image/jpeg;base64,..."
      expected_numeric_id: user.numericId
    }),
  });

  // 2. التحقق من نجاح الطلب
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  // 3. استقبال النتيجة
  const result: ThreeStepVerificationResult = await response.json();
  
  // 4. طباعة النتائج للتتبع
  console.log("Results:", {
    step1: result.step1_face_recognition.success ? "✓" : "✗",
    step2: result.step2_numeric_id_verification.success ? "✓" : "✗",
    overall: result.overall_success ? "✓" : "✗"
  });

  return result;
}
```

**مثال على النتيجة:**
```typescript
// نجاح:
{
  step1_face_recognition: {
    success: true,
    recognized_name: "John Doe",
    message: "Recognized: John Doe (85%)"
  },
  step2_numeric_id_verification: {
    success: true,
    firebase_numeric_id: 5,
    expected_numeric_id: 5,
    message: "IDs match"
  },
  overall_success: true
}

// فشل:
{
  step1_face_recognition: {
    success: false,
    message: "No face detected"
  },
  step2_numeric_id_verification: {
    success: false
  },
  overall_success: false,
  error: "Face not recognized"
}
```

---

### 3. markAttendance Function

```typescript
export const markAttendance = async (
  userId: string,
  userName: string
): Promise<void> => {
  
  // 1. الحصول على التاريخ والوقت الحالي
  const now = new Date();
  const date = now.toISOString().split('T')[0];  // "2024-01-15"
  const time = now.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });  // "09:00:00"
  
  // 2. تحديد حالة الحضور
  const workStartTime = '09:00:00';
  const isLate = time > workStartTime;
  
  // 3. إنشاء سجل الحضور
  const attendanceData = {
    userId: userId,
    employeeName: userName,
    date: date,
    checkIn: time,
    status: isLate ? 'Late' : 'Present',
    timestamp: serverTimestamp()  // Firebase server timestamp
  };
  
  // 4. حفظ في Firebase
  await addDoc(collection(db, 'attendance'), attendanceData);
  
  // 5. تحديث حالة المستخدم
  await updateDoc(doc(db, 'users', userId), {
    status: 'Active',
    lastLogin: serverTimestamp()
  });
};
```

**مثال على البيانات المحفوظة:**
```javascript
{
  userId: "user_0005_john.doe",
  employeeName: "John Doe",
  date: "2024-01-15",
  checkIn: "09:15:00",
  status: "Late",  // لأن 09:15 > 09:00
  timestamp: Timestamp(1705308900)
}
```

---

### 4. getUsers Function

```typescript
export const getUsers = async (): Promise<User[]> => {
  // 1. الحصول على reference للـ collection
  const usersCollection = collection(db, "users");
  
  // 2. جلب جميع المستندات
  const snapshot = await getDocs(usersCollection);
  
  // 3. تحويل المستندات إلى array من User objects
  const users = snapshot.docs.map(doc => ({
    id: doc.id,           // document ID
    ...doc.data()         // باقي البيانات
  } as User));
  
  return users;
};
```

**كيف يعمل map؟**
```typescript
// snapshot.docs يحتوي على:
[
  DocumentSnapshot { id: "user_0001_admin", data: {...} },
  DocumentSnapshot { id: "user_0002_john", data: {...} },
  DocumentSnapshot { id: "user_0003_jane", data: {...} }
]

// بعد map:
[
  { id: "user_0001_admin", name: "Admin", numericId: 1, ... },
  { id: "user_0002_john", name: "John Doe", numericId: 2, ... },
  { id: "user_0003_jane", name: "Jane Smith", numericId: 3, ... }
]
```

---

### 5. createUserWithId Function

```typescript
export const createUserWithId = async (
  userData: Omit<User, 'id' | 'numericId'>
): Promise<User> => {
  
  // 1. توليد رقم وظيفي جديد
  const numericId = await getNextUserId();
  // مثال: إذا آخر رقم = 14، يرجع 15
  
  // 2. إنشاء document ID
  const documentId = `user_${numericId.toString().padStart(4, '0')}_${userData.username}`;
  // مثال: "user_0015_ahmed.ali"
  
  // 3. إنشاء reference للمستند
  const userRef = doc(db, "users", documentId);
  
  // 4. إنشاء كائن المستخدم الكامل
  const newUser: User = {
    id: documentId,
    numericId,
    ...userData,
    systemAnnouncements: true,
    leaveStatusUpdates: true,
    attendanceReminders: true
  };
  
  // 5. حفظ في Firebase
  await setDoc(userRef, newUser);
  
  // 6. توليد face encoding
  if (userData.image) {
    try {
      const response = await fetch('http://localhost:5001/add-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          numericId: numericId,
          image: userData.image
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to generate face encoding');
      }
    } catch (error) {
      console.error('Face encoding failed:', error);
      alert('Warning: Face encoding failed');
    }
  }
  
  return newUser;
};
```

---

## 🔐 Session Management

### كيف يُحفظ المستخدم في Session؟

```typescript
// عند تسجيل الدخول:
const handleLogin = async (username: string, password: string) => {
  // 1. البحث عن المستخدم
  const users = await getUsers();
  const user = users.find(u => 
    u.username === username && u.password === password
  );
  
  if (user) {
    // 2. حفظ في sessionStorage
    sessionStorage.setItem('user', JSON.stringify(user));
    
    // 3. التحويل حسب نوع الحساب
    if (user.accountType === 'Admin') {
      router.push('/admin');
    } else if (user.accountType === 'Supervisor') {
      router.push('/supervisor');
    } else {
      router.push('/userData');
    }
  }
};

// في أي صفحة، للحصول على المستخدم:
const getUserFromSession = (): User | null => {
  const userStr = sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
```

---

## 📊 Dashboard Data Loading

### كيف تُحمل بيانات لوحة التحكم؟

```typescript
export const useDashboard = () => {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. جلب جميع المستخدمين
        const users = await getUsers();
        
        // 2. جلب حضور اليوم
        const todayAttendance = await getTodayAttendance();
        
        // 3. حساب الإحصائيات
        const totalMembers = users.filter(u => u.numericId !== 1).length;
        const presentToday = todayAttendance.length;
        const absentToday = totalMembers - presentToday;
        const lateToday = todayAttendance.filter(r => r.status === 'Late').length;
        
        // 4. تحديث الحالة
        setStats({
          totalMembers,
          presentToday,
          absentToday,
          lateToday
        });
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { stats, loading };
};
```

---

هذا شرح تفصيلي للأكواد المهمة في المشروع!
