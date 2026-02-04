import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface TotalHoursData {
  userId: string;
  totalHours: number;
  lastUpdated: string;
}

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
    console.log(`🔄 Adding ${hoursToAdd.toFixed(2)}h for user:`, userId);
    
    const docRef = doc(db, "totalHours", userId);
    const docSnap = await getDoc(docRef);
    const currentTotal = docSnap.exists() ? (docSnap.data().totalHours || 0) : 0;
    const newTotal = currentTotal + hoursToAdd;
    
    await setDoc(docRef, {
      userId,
      totalHours: newTotal,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    
    console.log(`✅ Successfully added hours. Previous: ${currentTotal.toFixed(2)}h, Added: ${hoursToAdd.toFixed(2)}h, New Total: ${newTotal.toFixed(2)}h`);
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
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const today = currentDate.toISOString().split('T')[0];
    
    const attendanceRef = collection(db, 'attendanceHistory');
    const q = query(
      attendanceRef,
      where('userId', '==', userId),
      where('date', '>=', startOfMonth.toISOString().split('T')[0]),
      where('date', '<', today) // Only get completed days, not today
    );
    
    const snapshot = await getDocs(q);
    let totalHours = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.workedHours) {
        totalHours += data.workedHours;
      }
    });
    
    // Add today's current session hours from totalHours collection (live counter)
    const currentTotal = await getTotalHours(userId);
    totalHours += currentTotal;
    
    console.log(`📊 Monthly Total: ${totalHours.toFixed(2)}h (Previous days: ${(totalHours - currentTotal).toFixed(2)}h + Today: ${currentTotal.toFixed(2)}h)`);
    
    return totalHours;
  } catch (error) {
    console.error('Error getting monthly total hours:', error);
    return await getTotalHours(userId);
  }
};