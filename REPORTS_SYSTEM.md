# نظام التقارير - Reports System

## 📊 نظرة عامة

تم إنشاء collection جديد في Firebase Firestore باسم `reports` لتخزين تقارير الموظفين والمشرفين.

## 🗂️ هيكل البيانات في Firebase

### Collection: `reports`

كل تقرير يحتوي على:

```javascript
{
  // للتقارير الخاصة بالموظفين
  employeeId: "EMP001",           // معرف الموظف
  reportType: "employee",          // نوع التقرير
  
  // أو للتقارير الخاصة بالمشرفين
  supervisorId: "SUP001",         // معرف المشرف
  reportType: "supervisor",        // نوع التقرير
  teamMembers: ["EMP001", "EMP002"], // أعضاء الفريق
  
  // بيانات مشتركة
  generatedAt: Timestamp,          // وقت إنشاء التقرير
  generatedBy: "USER_ID",          // من أنشأ التقرير
  
  period: {
    startDate: "2024-01-01",       // تاريخ البداية
    endDate: "2024-01-31"          // تاريخ النهاية
  },
  
  summary: {
    totalDays: 22,                 // إجمالي الأيام
    presentDays: 20,               // أيام الحضور
    absentDays: 2,                 // أيام الغياب
    lateDays: 3,                   // أيام التأخير
    totalHours: 176                // إجمالي الساعات
  },
  
  data: {
    // بيانات التقرير التفصيلية
    attendanceRecords: [...],
    charts: {...},
    statistics: {...}
  }
}
```

## 🔧 استخدام API

### 1. حفظ تقرير موظف

```javascript
// Frontend
import { saveEmployeeReport } from '@/utils/reportsApi';

const reportData = {
  period: {
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  },
  summary: {
    totalDays: 22,
    presentDays: 20,
    absentDays: 2,
    lateDays: 3,
    totalHours: 176
  },
  details: {
    // بيانات إضافية
  }
};

const result = await saveEmployeeReport('EMP001', reportData);
console.log('Report ID:', result.reportId);
```

### 2. حفظ تقرير مشرف

```javascript
import { saveSupervisorReport } from '@/utils/reportsApi';

const reportData = {
  period: {
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  },
  summary: {
    totalDays: 22,
    presentDays: 450,  // مجموع حضور الفريق
    absentDays: 34,
    lateDays: 12,
    totalHours: 3520
  },
  teamMembers: ['EMP001', 'EMP002', 'EMP003']
};

const result = await saveSupervisorReport('SUP001', reportData);
```

### 3. جلب تقارير موظف

```javascript
import { getEmployeeReports } from '@/utils/reportsApi';

const result = await getEmployeeReports('EMP001', 10); // آخر 10 تقارير
console.log('Reports:', result.reports);
```

### 4. جلب تقارير مشرف

```javascript
import { getSupervisorReports } from '@/utils/reportsApi';

const result = await getSupervisorReports('SUP001', 10);
console.log('Reports:', result.reports);
```

### 5. جلب تقرير محدد

```javascript
import { getReportById } from '@/utils/reportsApi';

const result = await getReportById('REPORT_ID');
console.log('Report:', result.report);
```

### 6. حذف تقرير

```javascript
import { deleteReport } from '@/utils/reportsApi';

const result = await deleteReport('REPORT_ID');
console.log('Deleted:', result.message);
```

## 🔌 API Endpoints

### Backend Routes

```
POST   /api/reports/employee          - حفظ تقرير موظف
POST   /api/reports/supervisor        - حفظ تقرير مشرف
GET    /api/reports/employee/:id      - جلب تقارير موظف
GET    /api/reports/supervisor/:id    - جلب تقارير مشرف
GET    /api/reports/:reportId         - جلب تقرير محدد
DELETE /api/reports/:reportId         - حذف تقرير
```

## 📝 تسجيل Routes في التطبيق

يجب إضافة routes التقارير في ملف التطبيق الرئيسي:

```python
# في backend/app/__init__.py أو server_factory.py
from app.routes.reports_routes import reports_bp

app.register_blueprint(reports_bp)
```

## 💡 أمثلة استخدام في Components

### مثال: حفظ تقرير عند توليده

```typescript
// في صفحة التقارير
const handleGenerateReport = async () => {
  const reportData = {
    period: { startDate, endDate },
    summary: calculateSummary(),
    details: getDetailedData()
  };
  
  const result = await saveEmployeeReport(employeeId, reportData);
  
  if (result.success) {
    toast.success('تم حفظ التقرير بنجاح');
  }
};
```

### مثال: عرض التقارير المحفوظة

```typescript
const [reports, setReports] = useState([]);

useEffect(() => {
  const loadReports = async () => {
    const result = await getEmployeeReports(employeeId);
    if (result.success) {
      setReports(result.reports);
    }
  };
  
  loadReports();
}, [employeeId]);
```

## 🔒 الأمان

- جميع endpoints تتحقق من توفر Firebase
- يتم التحقق من البيانات المطلوبة قبل الحفظ
- معالجة الأخطاء بشكل شامل
- يمكن إضافة authentication middleware للحماية

## 📊 Firebase Console

يمكنك عرض التقارير المحفوظة في Firebase Console:
1. افتح Firebase Console
2. اذهب إلى Firestore Database
3. ابحث عن collection اسمه `reports`
4. ستجد جميع التقارير المحفوظة هناك

## ✅ الخطوات التالية

1. ✅ تم إنشاء `reports_service.py`
2. ✅ تم إنشاء `reports_routes.py`
3. ✅ تم إنشاء `reportsApi.ts` للـ Frontend
4. ⏳ تسجيل routes في التطبيق الرئيسي
5. ⏳ إضافة authentication middleware
6. ⏳ دمج مع صفحات التقارير الموجودة
