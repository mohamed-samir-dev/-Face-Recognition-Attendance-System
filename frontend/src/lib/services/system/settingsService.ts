import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { User } from "@/lib/types";
import { Department } from "@/components/admin/departments/types";
import { CompanySettings, Holiday } from "@/components/admin/settings/types";
import { initializeTotalHoursForAllUsers } from "../attendance/initializeTotalHours";


export const getCompanySettings = async (): Promise<CompanySettings> => {
  try {
    const [holidaysSnapshot, departmentsSnapshot, settingsDoc] = await Promise.all([
      getDocs(collection(db, "holidays")),
      getDocs(collection(db, "departments")),
      getDoc(doc(db, "settings", "company"))
    ]);

    const holidays = holidaysSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Holiday));
    const departments = departmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
    
    const settingsData = settingsDoc.exists() ? settingsDoc.data() : {};

    return {
      workingHours: settingsData.workingHours || { startTime: "09:00", endTime: "17:00" },
      holidays,
      departments,
      attendanceRules: settingsData.attendanceRules || { gracePeriod: 15, vacationDays: 30 }
    };
  } catch {
    return {
      workingHours: { startTime: "09:00", endTime: "17:00" },
      holidays: [],
      departments: [],
      attendanceRules: { gracePeriod: 15, vacationDays: 30 }
    };
  }
};

export const addHoliday = async (holiday: Omit<Holiday, 'id'>): Promise<void> => {
  const timestamp = new Date().getTime();
  const holidayName = holiday.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const documentId = `holiday_${holidayName}_${timestamp}`;
  const holidayRef = doc(db, "holidays", documentId);
  await setDoc(holidayRef, { ...holiday, id: documentId });
  
  // Notify all employees
  try {
    const { createVacationNotificationForAllEmployees } = await import('./notificationService');
    const message = `New vacation announced: ${holiday.name} from ${new Date(holiday.date).toLocaleDateString()}${holiday.endDate ? ` to ${new Date(holiday.endDate).toLocaleDateString()}` : ''}`;
    console.log('Sending notification:', message);
    await createVacationNotificationForAllEmployees(message);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

export const addDepartment = async (department: Omit<Department, 'id'>): Promise<void> => {
  const timestamp = new Date().getTime();
  const deptName = department.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const documentId = `department_${deptName}_${timestamp}`;
  const deptRef = doc(db, "departments", documentId);
  
  const newDepartment = {
    ...department,
    id: documentId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    employeeCount: 0
  };
  
  await setDoc(deptRef, newDepartment);
};

export const updateDepartment = async (departmentId: string, department: Partial<Department>): Promise<void> => {
  const deptRef = doc(db, "departments", departmentId);
  await updateDoc(deptRef, {
    ...department,
    updatedAt: new Date().toISOString()
  });
};

export const deleteDepartment = async (departmentId: string): Promise<void> => {
  await deleteDoc(doc(db, "departments", departmentId));
};

export const getDepartmentEmployees = async (departmentName: string): Promise<User[]> => {
  try {
    const { getUsers } = await import('../user/userService');
    const users = await getUsers();
    return users.filter(user => 
      user.department === departmentName || user.Department === departmentName
    );
  } catch (error) {
    console.error('Error fetching department employees:', error);
    return [];
  }
};

export const updateDepartmentEmployeeCount = async (departmentId: string): Promise<void> => {
  try {
    const departments = await getDocs(collection(db, "departments"));
    const department = departments.docs.find(doc => doc.id === departmentId);
    
    if (department) {
      const deptData = department.data();
      const employees = await getDepartmentEmployees(deptData.name);
      const deptRef = doc(db, "departments", departmentId);
      await updateDoc(deptRef, {
        employeeCount: employees.length,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error updating employee count:', error);
  }
};

export const updateSettings = async (settings: Partial<CompanySettings>): Promise<void> => {
  const settingsRef = doc(db, "settings", "company");
  try {
    const existingDoc = await getDoc(settingsRef);
    if (existingDoc.exists()) {
      await updateDoc(settingsRef, settings);
    } else {
      await setDoc(settingsRef, settings);
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    await setDoc(settingsRef, settings, { merge: true });
  }
  
  // Initialize totalHours collection if it doesn't exist
  try {
    await initializeTotalHoursForAllUsers();
  } catch (error) {
    console.log("TotalHours collection already exists or error:", error);
  }
};

export const updateHoliday = async (holidayId: string, holiday: Partial<Holiday>): Promise<void> => {
  const holidayRef = doc(db, "holidays", holidayId);
  await updateDoc(holidayRef, holiday);
  
  // Notify all employees
  try {
    const { createHolidayUpdateNotificationForAllEmployees } = await import('./notificationService');
    const message = `📅 Holiday updated: ${holiday.name || 'Holiday'} has been modified`;
    await createHolidayUpdateNotificationForAllEmployees(message);
  } catch (error) {
    console.error('Error sending update notifications:', error);
  }
};

export const deleteHoliday = async (holidayId: string, holidayName: string): Promise<void> => {
  await deleteDoc(doc(db, "holidays", holidayId));
  
  // Notify all employees
  try {
    const { createHolidayDeleteNotificationForAllEmployees } = await import('./notificationService');
    const message = `❌ Holiday cancelled: ${holidayName} has been removed from the calendar`;
    await createHolidayDeleteNotificationForAllEmployees(message);
  } catch (error) {
    console.error('Error sending delete notifications:', error);
  }
};