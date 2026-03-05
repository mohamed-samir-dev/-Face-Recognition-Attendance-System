import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface OvertimeRecord {
  userId: string;
  userName: string;
  overtimeHours: number;
  lastUpdated: string;
}

export const saveOvertimeRecord = async (
  userId: string,
  userName: string,
  overtimeHours: number,
): Promise<void> => {
  if (overtimeHours <= 0) return;

  const overtimeData: OvertimeRecord = {
    userId,
    userName,
    overtimeHours: Math.round(overtimeHours * 100) / 100,
    lastUpdated: new Date().toISOString(),
  };

  await setDoc(doc(db, "overtime", userId), overtimeData, { merge: true });
};

export const getTodayOvertime = async (userId: string): Promise<number> => {
  try {
    const { doc: firestoreDoc, getDoc } = await import('firebase/firestore');
    const { getCompanySettings } = await import('../system/settingsService');
    
    const timerDoc = await getDoc(firestoreDoc(db, 'timers', userId));
    if (timerDoc.exists()) {
      const timerData = timerDoc.data();
      if (timerData.checkInTime && timerData.active) {
        const now = new Date();
        const settings = await getCompanySettings();
        const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);
        
        if (now.getTime() > workEnd.getTime()) {
          const overtimeMs = now.getTime() - workEnd.getTime();
          return overtimeMs / (1000 * 60 * 60);
        }
      }
    }
    return 0;
  } catch (error) {
    console.error('Error getting today overtime:', error);
    return 0;
  }
};

export const getMonthlyOvertime = async (userId: string): Promise<number> => {
  try {
    const { collection, query, where, getDocs, doc: firestoreDoc, getDoc } = await import('firebase/firestore');
    const { getCompanySettings } = await import('../system/settingsService');
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const today = currentDate.toISOString().split('T')[0];
    
    const attendanceRef = collection(db, 'attendance');
    const q = query(
      attendanceRef,
      where('userId', '==', userId),
      where('date', '>=', startOfMonth.toISOString().split('T')[0]),
      where('date', '<=', today)
    );
    
    const snapshot = await getDocs(q);
    let totalOvertime = 0;
    let todayRecorded = false;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.overtimeHours) {
        totalOvertime += data.overtimeHours;
        if (data.date === today) {
          todayRecorded = true;
        }
      }
    });
    
    if (!todayRecorded) {
      const timerDoc = await getDoc(firestoreDoc(db, 'timers', userId));
      if (timerDoc.exists()) {
        const timerData = timerDoc.data();
        if (timerData.checkInTime && timerData.active) {
          const now = new Date();
          const settings = await getCompanySettings();
          const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);
          
          if (now.getTime() > workEnd.getTime()) {
            const overtimeMs = now.getTime() - workEnd.getTime();
            const currentOvertime = overtimeMs / (1000 * 60 * 60);
            totalOvertime += currentOvertime;
          }
        }
      }
    }
    
    return totalOvertime;
  } catch (error) {
    console.error('Error getting monthly overtime:', error);
    return 0;
  }
};

export const resetOvertimeHours = async (userId: string): Promise<void> => {
  const docRef = doc(db, "overtime", userId);
  await setDoc(docRef, {
    userId,
    userName: 'Unknown',
    overtimeHours: 0,
    lastUpdated: new Date().toISOString()
  });
};

export const getOvertimeRecord = async (userId: string): Promise<OvertimeRecord | null> => {
  const docRef = doc(db, "overtime", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as OvertimeRecord : null;
};
