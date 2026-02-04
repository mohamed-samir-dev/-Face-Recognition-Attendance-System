import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getCompanySettings } from "../system/settingsService";
import { addWorkedHours } from "./totalHoursService";
import {TimerData}from "../../types/services"


class LocalTimer {
  private intervalId: NodeJS.Timeout | null = null;
  private remaining: number = 0;
  private onUpdate: (remaining: number) => void = () => {};
  private onComplete: () => void = () => {};

  start(initialRemaining: number, onUpdate: (remaining: number) => void, onComplete: () => void) {
    this.remaining = Math.floor(initialRemaining / 1000);
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
    
    this.onUpdate(this.remaining);
    
    this.intervalId = setInterval(() => {
      this.remaining--;
      this.onUpdate(this.remaining);
      
      if (this.remaining <= 0) {
        this.stop();
        this.onComplete();
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getRemaining() {
    return this.remaining;
  }
}

export const localTimer = new LocalTimer();

export const startWorkTimer = async (userId: string): Promise<void> => {
  const now = new Date();
  const checkInTime = now.toTimeString().split(' ')[0];
  
  const settings = await getCompanySettings();
  const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);
  const initialRemaining = Math.max(0, workEnd.getTime() - now.getTime());
  
  const timerData: TimerData = {
    userId,
    startTime: now.getTime(),
    remaining: initialRemaining,
    active: true,
    totalHours: 0,
    checkInTime,
    actualWorkedHours: 0
  };

  await setDoc(doc(db, "timers", userId), timerData);
  console.log('✓ Timer started:', { userId, checkInTime, endTime: settings.workingHours.endTime });
};

export const getTimerData = async (userId: string): Promise<TimerData | null> => {
  try {
    const docRef = doc(db, "timers", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as TimerData : null;
  } catch {
    return null;
  }
};

export const calculateRemainingTime = async (timerData: TimerData): Promise<number> => {
  if (!timerData.checkInTime) return 0;
  
  const now = new Date();
  const settings = await getCompanySettings();
  const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);
  
  return Math.max(0, workEnd.getTime() - now.getTime());
};



export const completeTimer = async (userId: string): Promise<void> => {
  try {
    const timerData = await getTimerData(userId);
    if (!timerData || !timerData.checkInTime) return;

    const now = new Date();
    const checkInTime = new Date(`${now.toDateString()} ${timerData.checkInTime}`);
    const actualWorkedMs = now.getTime() - checkInTime.getTime();
    const actualWorkedHours = actualWorkedMs / (1000 * 60 * 60);
    
    const settings = await getCompanySettings();
    const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);
    const overtimeHours = now.getTime() > workEnd.getTime() ? (now.getTime() - workEnd.getTime()) / (1000 * 60 * 60) : 0;

    localTimer.stop();
    
    await updateDoc(doc(db, "timers", userId), {
      active: false,
      actualWorkedHours,
      remaining: 0
    });
    
    if (overtimeHours > 0) {
      const { saveOvertimeRecord } = await import('./overtimeService');
      const { doc: firestoreDoc, getDoc } = await import('firebase/firestore');
      const userDoc = await getDoc(firestoreDoc(db, 'users', userId));
      const userName = userDoc.exists() ? userDoc.data().name : 'Unknown';
      await saveOvertimeRecord(userId, userName, overtimeHours, timerData.checkInTime);
    }
  } catch (error) {
    console.error('Error completing timer:', error);
    throw error;
  }
};



export const stopTimer = async (userId: string): Promise<void> => {
  localTimer.stop();
  await updateDoc(doc(db, "timers", userId), { active: false });
};

export const deleteTimer = async (userId: string): Promise<void> => {
  localTimer.stop();
  await deleteDoc(doc(db, "timers", userId));
};

export const resetTimer = async (userId: string): Promise<void> => {
  localTimer.stop();
  await updateDoc(doc(db, "timers", userId), {
    active: false,
    remaining: 0,
    actualWorkedHours: 0,
    checkInTime: undefined
  });
};

export const getTimerInfo = async (userId: string) => {
  const timerData = await getTimerData(userId);
  if (!timerData || !timerData.checkInTime) return null;
  
  const now = new Date();
  const checkInTime = new Date(`${now.toDateString()} ${timerData.checkInTime}`);
  const elapsed = now.getTime() - checkInTime.getTime();
  const elapsedHours = elapsed / (1000 * 60 * 60);
  
  const settings = await getCompanySettings();
  const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);
  const dynamicRemaining = Math.max(0, workEnd.getTime() - now.getTime());
  
  // Check if in overtime
  const isOvertime = now.getTime() > workEnd.getTime();
  const overtimeMs = isOvertime ? now.getTime() - workEnd.getTime() : 0;
  const overtimeHours = overtimeMs / (1000 * 60 * 60);
  
  return {
    checkInTime: timerData.checkInTime,
    elapsedHours: Math.round(elapsedHours * 100) / 100,
    remainingMs: dynamicRemaining,
    isActive: timerData.active,
    isOvertime,
    overtimeHours: Math.round(overtimeHours * 100) / 100
  };
};