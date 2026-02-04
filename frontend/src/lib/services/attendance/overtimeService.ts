import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
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
  checkInTime: string
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
  const docRef = doc(db, "overtime", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data().overtimeHours || 0) : 0;
};

export const getMonthlyOvertime = async (userId: string): Promise<number> => {
  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const attendanceRef = collection(db, 'attendance');
    const q = query(
      attendanceRef,
      where('userId', '==', userId),
      where('date', '>=', startOfMonth.toISOString().split('T')[0]),
      where('date', '<=', endOfMonth.toISOString().split('T')[0])
    );
    
    const snapshot = await getDocs(q);
    let totalOvertime = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.overtimeHours) {
        totalOvertime += data.overtimeHours;
      }
    });
    
    // Add today's ongoing overtime if exists
    const todayOvertime = await getTodayOvertime(userId);
    totalOvertime += todayOvertime;
    
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
