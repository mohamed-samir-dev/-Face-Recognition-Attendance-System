import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface WorkingHours {
  startTime: string;
  endTime: string;
}

export const getWorkingHours = async (): Promise<WorkingHours> => {
  const settingsDoc = await getDoc(doc(db, "settings", "company"));
  if (settingsDoc.exists()) {
    return settingsDoc.data().workingHours || { startTime: "09:00", endTime: "17:00" };
  }
  return { startTime: "09:00", endTime: "17:00" };
};

export const isWithinWorkingHours = (workingHours: WorkingHours): boolean => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  return currentTime >= workingHours.startTime && currentTime <= workingHours.endTime;
};

export const getLastMonitoringTime = async (employeeId: string): Promise<Date | null> => {
  const userDoc = await getDoc(doc(db, "users", employeeId));
  if (userDoc.exists()) {
    const data = userDoc.data();
    return data.lastMonitoringTime ? new Date(data.lastMonitoringTime) : null;
  }
  return null;
};

export const updateLastMonitoringTime = async (employeeId: string): Promise<void> => {
  await updateDoc(doc(db, "users", employeeId), {
    lastMonitoringTime: new Date().toISOString()
  });
};

export const canShowMonitoring = async (employeeId: string): Promise<boolean> => {
  // Check if user is active
  const userDoc = await getDoc(doc(db, "users", employeeId));
  if (!userDoc.exists()) return false;
  
  const userData = userDoc.data();
  if (!userData.isActive) return false;

  const workingHours = await getWorkingHours();
  if (!isWithinWorkingHours(workingHours)) return false;

  const lastTime = userData.lastMonitoringTime ? new Date(userData.lastMonitoringTime) : null;
  if (!lastTime) return true;

  const hoursSinceLastMonitoring = (Date.now() - lastTime.getTime()) / (1000 * 60 * 60);
  return hoursSinceLastMonitoring >= 1;
};

export const calculateNextMonitoringDelay = (): number => {
  const minDelay = 60 * 60 * 1000; // 1 hour
  const maxDelay = 3 * 60 * 60 * 1000; // 3 hours
  return Math.random() * (maxDelay - minDelay) + minDelay;
};
