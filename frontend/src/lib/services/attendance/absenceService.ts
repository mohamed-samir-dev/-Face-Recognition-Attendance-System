import { collection, getDocs, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface AbsenceRecord {
  id: string;
  userId: string;
  employeeId: number;
  employeeName: string;
  department: string;
  date: string;
  month: string;
  year: number;
  reason: 'Unexcused' | 'NoShow' | 'Sick' | 'Personal';
  status: 'Recorded' | 'Excused' | 'Disputed';
  notes?: string;
  recordedAt: string;
  recordedBy: string;
}

export const getMonthlyAbsences = async (userId?: string): Promise<number> => {
  if (!userId) return 0;
  
  try {
    const currentDate = new Date();
    const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const absencesRef = collection(db, "employeeAbsences");
    const q = query(
      absencesRef,
      where("userId", "==", userId),
      where("month", "==", month),
      where("status", "==", "Recorded")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching monthly absences:', error);
    return 0;
  }
};

export const checkAndRecordAbsences = async (targetDate?: string): Promise<void> => {
  try {
    const { getUsers } = await import('../user/userService');
    const { getCompanySettings } = await import('../system/settingsService');
    
    const [users, settings] = await Promise.all([
      getUsers(),
      getCompanySettings()
    ]);
    
    const today = new Date();
    const checkDate = targetDate ? new Date(targetDate) : today;
    const dateStr = checkDate.toISOString().split('T')[0];
    const dayOfWeek = checkDate.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) return;
    
    const workEndTime = settings?.workingHours?.endTime || '17:00';
    const [endHour, endMinute] = workEndTime.split(':').map(Number);
    const workEndDateTime = new Date(checkDate);
    workEndDateTime.setHours(endHour, endMinute, 0, 0);
    
    if (!targetDate && today < workEndDateTime) {
      console.log('Working hours not ended yet. Skipping absence check.');
      return;
    }
    
    const attendanceCollection = collection(db, "attendance");
    const attendanceQuery = query(attendanceCollection, where("date", "==", dateStr));
    const attendanceSnapshot = await getDocs(attendanceQuery);
    const todayAttendance = attendanceSnapshot.docs.map(doc => doc.data() as Record<string, unknown>);
    
    const employees = users.filter(user => user.numericId !== 1);
    const attendedUserIds = new Set(todayAttendance.map((record) => record.userId as string));
    
    const leaveCollection = collection(db, "leaveRequests");
    const leaveQuery = query(leaveCollection, where("status", "==", "Approved"));
    const leaveSnapshot = await getDocs(leaveQuery);
    const usersOnLeaveToday = new Set(
      leaveSnapshot.docs
        .filter(doc => {
          const leave = doc.data();
          return dateStr >= leave.startDate && dateStr <= leave.endDate;
        })
        .map(doc => doc.data().userId)
    );
    
    const absentEmployees = employees.filter(employee => 
      !attendedUserIds.has(employee.id) && !usersOnLeaveToday.has(employee.id)
    );
    
    for (const employee of absentEmployees) {
      const absenceId = `${employee.id}_${dateStr}`;
      const absenceRef = doc(db, "employeeAbsences", absenceId);
      
      const absenceData: AbsenceRecord = {
        id: absenceId,
        userId: employee.id,
        employeeId: employee.numericId || 0,
        employeeName: employee.name,
        department: employee.department || employee.Department || 'N/A',
        date: dateStr,
        month: `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}`,
        year: checkDate.getFullYear(),
        reason: 'Unexcused',
        status: 'Recorded',
        notes: `No attendance registered by end of working hours (${workEndTime})`,
        recordedAt: new Date().toISOString(),
        recordedBy: 'System'
      };
      
      await setDoc(absenceRef, absenceData);
    }
    
    console.log(`Recorded ${absentEmployees.length} absences for ${dateStr}`);
  } catch (error) {
    console.error('Error checking and recording absences:', error);
  }
};

export const deleteAbsenceRecord = async (userId: string, date: string): Promise<void> => {
  try {
    const absenceId = `${userId}_${date}`;
    const absenceRef = doc(db, "employeeAbsences", absenceId);
    await deleteDoc(absenceRef);
  } catch (error) {
    console.error('Error deleting absence record:', error);
  }
};

export const getEmployeeAbsenceRecords = async (userId: string, month?: string): Promise<AbsenceRecord[]> => {
  try {
    const absencesRef = collection(db, "employeeAbsences");
    let q = query(absencesRef, where("userId", "==", userId));
    
    if (month) {
      q = query(absencesRef, where("userId", "==", userId), where("month", "==", month));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as AbsenceRecord);
  } catch (error) {
    console.error('Error fetching absence records:', error);
    return [];
  }
};

export const updateAbsenceStatus = async (
  absenceId: string, 
  status: 'Recorded' | 'Excused' | 'Disputed',
  notes?: string
): Promise<void> => {
  try {
    const absenceRef = doc(db, "employeeAbsences", absenceId);
    await setDoc(absenceRef, { status, notes, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error('Error updating absence status:', error);
  }
};