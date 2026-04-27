import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const getTotalHours = async (userId: string): Promise<number> => {
  try {
    const docRef = doc(db, "totalHours", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data().totalHours || 0) : 0;
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
      totalHours: Math.round(newTotal * 100) / 100,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error adding worked hours:', error);
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

/**
 * Gets monthly total hours directly from totalHours collection.
 * Adds live session hours if timer is currently active.
 */
export const getMonthlyTotalHours = async (userId: string): Promise<number> => {
  try {
    // Read stored total from totalHours collection
    const docRef = doc(db, "totalHours", userId);
    const docSnap = await getDoc(docRef);
    let totalHours = docSnap.exists() ? (docSnap.data().totalHours || 0) : 0;

    // Add live session hours if timer is active
    const { doc: firestoreDoc, getDoc: fsGetDoc } = await import('firebase/firestore');
    const timerDoc = await fsGetDoc(firestoreDoc(db, 'timers', userId));
    if (timerDoc.exists()) {
      const timerData = timerDoc.data();
      if (timerData.checkInTime && timerData.active) {
        const now = new Date();
        const checkInTime = new Date(`${now.toDateString()} ${timerData.checkInTime}`);
        const { getCompanySettings } = await import('../system/settingsService');
        const settings = await getCompanySettings();
        const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);
        const cappedNow = now > workEnd ? workEnd : now;
        const liveHours = (cappedNow.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        totalHours += Math.max(0, liveHours);
      }
    }

    return totalHours;
  } catch (error) {
    console.error('Error getting monthly total hours:', error);
    return 0;
  }
};

/**
 * Saves the final worked hours to totalHours collection on checkout.
 * Calculates actual hours from checkIn to now (capped at workEnd) and adds to stored total.
 */
export const saveFinalWorkedHours = async (userId: string, workedHours: number): Promise<void> => {
  try {
    const docRef = doc(db, "totalHours", userId);
    const docSnap = await getDoc(docRef);
    const currentTotal = docSnap.exists() ? (docSnap.data().totalHours || 0) : 0;

    await setDoc(docRef, {
      userId,
      totalHours: Math.round((currentTotal + workedHours) * 100) / 100,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving final worked hours:', error);
    throw error;
  }
};
