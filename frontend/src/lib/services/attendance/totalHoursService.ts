import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";



export const getTotalHours = async (userId: string): Promise<number> => {
  try {
    const docRef = doc(db, "totalHours", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().totalHours : 0;
  } catch {
    return 0;
  }
};

export const addWorkedHours = async (userId: string, hoursToAdd: number): Promise<void> => {
  try {
    const docRef = doc(db, "totalHours", userId);
    const docSnap = await getDoc(docRef);
    const currentTotal = docSnap.exists() ? (docSnap.data().totalHours || 0) : 0;
    const newTotal = currentTotal + hoursToAdd;
    
    await setDoc(docRef, {
      userId,
      totalHours: newTotal,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    
  } catch (error) {
    console.error('❌ Error adding worked hours:', error);
    throw error;
  }
};

export const resetTotalHours = async (userId: string): Promise<void> => {
  const docRef = doc(db, "totalHours", userId);
  await setDoc(docRef, {
    userId,
    totalHours: 0,
    lastUpdated: new Date().toISOString()
  });
};

export const getMonthlyTotalHours = async (userId: string): Promise<number> => {
  try {
    const { collection, query, where, getDocs, doc: firestoreDoc, getDoc } = await import('firebase/firestore');
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const today = currentDate.toISOString().split('T')[0];
    
    const attendanceRef = collection(db, 'attendanceHistory');
    const q = query(
      attendanceRef,
      where('userId', '==', userId),
      where('date', '>=', startOfMonth.toISOString().split('T')[0]),
      where('date', '<=', today)
    );
    
    const snapshot = await getDocs(q);
    let totalHours = 0;
    let todayRecorded = false;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.workedHours) {
        totalHours += data.workedHours;
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
          const todayStr = now.toDateString();
          const checkInTime = new Date(`${todayStr} ${timerData.checkInTime}`);
          const currentSessionHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
          totalHours += currentSessionHours;
        }
      }
    }
    
    return totalHours;
  } catch (error) {
    console.error('Error getting monthly total hours:', error);
    return 0;
  }
};