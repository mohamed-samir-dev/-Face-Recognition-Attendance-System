import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface OvertimeRecord {
  userId: string;
  userName: string;
  overtimeHours: number;
  lastUpdated: string;
}

/**
 * Saves/updates overtime record. Used during live overtime tracking (every 60s).
 * This overwrites the current live overtime value (not cumulative).
 */
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

/**
 * Gets today's live overtime from active timer.
 */
export const getTodayOvertime = async (userId: string): Promise<number> => {
  try {
    const { getCompanySettings } = await import('../system/settingsService');

    const timerDoc = await getDoc(doc(db, 'timers', userId));
    if (timerDoc.exists()) {
      const timerData = timerDoc.data();
      if (timerData.checkInTime && timerData.active) {
        const now = new Date();
        const settings = await getCompanySettings();
        const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);

        if (now.getTime() > workEnd.getTime()) {
          return (now.getTime() - workEnd.getTime()) / (1000 * 60 * 60);
        }
      }
    }
    return 0;
  } catch (error) {
    console.error('Error getting today overtime:', error);
    return 0;
  }
};

/**
 * Gets monthly overtime directly from overtime collection.
 * Adds live overtime if timer is currently active and past work end time.
 */
export const getMonthlyOvertime = async (userId: string): Promise<number> => {
  try {
    // Read stored total from overtime collection
    const docRef = doc(db, "overtime", userId);
    const docSnap = await getDoc(docRef);
    let totalOvertime = docSnap.exists() ? (docSnap.data().overtimeHours || 0) : 0;

    // Add live overtime if timer is active
    const timerDoc = await getDoc(doc(db, 'timers', userId));
    if (timerDoc.exists()) {
      const timerData = timerDoc.data();
      if (timerData.checkInTime && timerData.active) {
        const now = new Date();
        const { getCompanySettings } = await import('../system/settingsService');
        const settings = await getCompanySettings();
        const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);

        if (now.getTime() > workEnd.getTime()) {
          const liveOvertime = (now.getTime() - workEnd.getTime()) / (1000 * 60 * 60);
          totalOvertime += liveOvertime;
        }
      }
    }

    return totalOvertime;
  } catch (error) {
    console.error('Error getting monthly overtime:', error);
    return 0;
  }
};

/**
 * Saves final overtime hours to overtime collection on checkout.
 * Adds the checkout overtime to the stored total.
 */
export const saveFinalOvertime = async (
  userId: string,
  userName: string,
  overtimeHoursToAdd: number
): Promise<void> => {
  if (overtimeHoursToAdd <= 0) return;

  try {
    const docRef = doc(db, "overtime", userId);
    const docSnap = await getDoc(docRef);
    const currentTotal = docSnap.exists() ? (docSnap.data().overtimeHours || 0) : 0;

    await setDoc(docRef, {
      userId,
      userName,
      overtimeHours: Math.round((currentTotal + overtimeHoursToAdd) * 100) / 100,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving final overtime:', error);
    throw error;
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
