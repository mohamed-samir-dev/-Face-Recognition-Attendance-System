import { useState, useEffect, useRef } from 'react';
import { getTimerData, startWorkTimer, completeTimer, resetTimer, calculateRemainingTime } from '@/lib/services/attendance/timerService';
import { getTotalHours, resetTotalHours } from '@/lib/services/attendance/totalHoursService';
import { getCompanySettings } from '@/lib/services/system/settingsService';
import { getTodayOvertime, saveOvertimeRecord } from '@/lib/services/attendance/overtimeService';

export const useWorkTimer = (userId?: string) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [baseTotalHours, setBaseTotalHours] = useState<number>(0);
  const [currentSessionHours, setCurrentSessionHours] = useState<number>(0);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [isOvertime, setIsOvertime] = useState(false);


  useEffect(() => {
    if (!userId) return;

    const setupTotalHoursListener = async () => {
      const { doc, onSnapshot } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase/config');
      const { getMonthlyTotalHours } = await import('@/lib/services/attendance/totalHoursService');
      
      // Initial load of monthly total
      const monthlyTotal = await getMonthlyTotalHours(userId);
      setBaseTotalHours(monthlyTotal);
      
      // Listen for real-time updates
      const unsubscribe = onSnapshot(doc(db, 'totalHours', userId), async () => {
        const updatedMonthlyTotal = await getMonthlyTotalHours(userId);
        setBaseTotalHours(updatedMonthlyTotal);
      });

      return unsubscribe;
    };

    const handleTimerCompleted = () => {
      setIsActive(false);
      setTimeRemaining(0);
    };

    window.addEventListener('timerCompleted', handleTimerCompleted);

    const unsubscribePromise = setupTotalHoursListener();
    return () => {
      window.removeEventListener('timerCompleted', handleTimerCompleted);
      unsubscribePromise.then(unsub => unsub());
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const loadTimer = async () => {
      const timerData = await getTimerData(userId);
      if (timerData && timerData.checkInTime) {
        const newRemaining = await calculateRemainingTime(timerData);
        setTimeRemaining(newRemaining);
        setIsActive(timerData.active);
        
        // Check if currently in overtime
        const now = new Date();
        const settings = await getCompanySettings();
        const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);
        const currentlyOvertime = now.getTime() > workEnd.getTime();
        
        setIsOvertime(currentlyOvertime);
        if (currentlyOvertime) {
          const overtimeMs = now.getTime() - workEnd.getTime();
          setOvertimeHours(overtimeMs / (1000 * 60 * 60));
        } else {
          // Load today's overtime from separate collection
          const todayOvertime = await getTodayOvertime(userId);
          setOvertimeHours(todayOvertime);
        }
      }
    };

    loadTimer();
    
    // Listen for timer started event to reload data immediately
    const handleTimerStarted = () => {
      setTimeout(loadTimer, 100); // Small delay to ensure data is written
    };
    
    window.addEventListener('timerStarted', handleTimerStarted);
    
    return () => {
      window.removeEventListener('timerStarted', handleTimerStarted);
    };
  }, [userId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (userId) {
      interval = setInterval(async () => {
        const timerData = await getTimerData(userId!);
        if (timerData && timerData.checkInTime && timerData.active) {
          const now = new Date();
          const settings = await getCompanySettings();
          const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);
          const checkInTime = new Date(`${now.toDateString()} ${timerData.checkInTime}`);
          
          if (now.getTime() <= workEnd.getTime()) {
            // During regular hours: update total hours continuously
            const sessionMs = now.getTime() - checkInTime.getTime();
            const sessionHours = Math.max(0, sessionMs / (1000 * 60 * 60));
            setCurrentSessionHours(sessionHours);
            
            const newRemaining = await calculateRemainingTime(timerData);
            setTimeRemaining(newRemaining);
            setIsOvertime(false);
            setOvertimeHours(0);
          } else {
            // During overtime: cap regular hours and track overtime separately
            const regularSessionMs = workEnd.getTime() - checkInTime.getTime();
            const regularSessionHours = Math.max(0, regularSessionMs / (1000 * 60 * 60));
            setCurrentSessionHours(regularSessionHours);
            
            const overtimeMs = now.getTime() - workEnd.getTime();
            const overtime = overtimeMs / (1000 * 60 * 60);
            setIsOvertime(true);
            setOvertimeHours(overtime);
            setTimeRemaining(0);
            
            // Update overtime in Firebase every minute
            const { saveOvertimeRecord } = await import('@/lib/services/attendance/overtimeService');
            const { doc: firestoreDoc, getDoc } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase/config');
            const userDoc = await getDoc(firestoreDoc(db, 'users', userId!));
            const userName = userDoc.exists() ? userDoc.data().name : 'Unknown';
            await saveOvertimeRecord(userId!, userName, overtime, timerData.checkInTime);
          }
        } else {
          setCurrentSessionHours(0);
          setIsActive(false);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [userId]);

  // Separate interval to update total hours in Firebase every minute
  const isOvertimeRef = useRef(isOvertime);
  useEffect(() => {
    isOvertimeRef.current = isOvertime;
  }, [isOvertime]);

  useEffect(() => {
    let totalHoursInterval: NodeJS.Timeout;
    let isUpdating = false;
    
    if (userId && isActive) {
      totalHoursInterval = setInterval(async () => {
        if (isUpdating || isOvertimeRef.current) {
          return;
        }
        
        isUpdating = true;
        try {
          const { addWorkedHours } = await import('@/lib/services/attendance/totalHoursService');
          const minuteInHours = 1 / 60;
          await addWorkedHours(userId!, minuteInHours);
        } catch (error) {
          console.error('Error adding worked hours:', error);
        } finally {
          isUpdating = false;
        }
      }, 60000);
    }

    return () => {
      if (totalHoursInterval) {
        clearInterval(totalHoursInterval);
      }
    };
  }, [userId, isActive]);

  const startTimer = async () => {
    if (!userId) return;
    
    await startWorkTimer(userId);
    const timerData = await getTimerData(userId);
    if (timerData && timerData.remaining > 0) {
      setTimeRemaining(timerData.remaining);
      setIsActive(true);
    }
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatOvertimeHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const resetTimerData = async () => {
    if (!userId) return;
    await resetTimer(userId);
    await resetTotalHours(userId);
    setTimeRemaining(0);
    setIsActive(false);
    setTotalHours(0);
    setBaseTotalHours(0);
    setCurrentSessionHours(0);
  };

  // Display monthly total hours from Firebase (updated every minute)
  const displayTotalHours = baseTotalHours;

  return {
    timeRemaining: !isOvertime ? formatTime(timeRemaining) : '0:00:00',
    overtimeTimer: isOvertime ? formatOvertimeHours(overtimeHours) : undefined,
    isActive,
    totalHours: displayTotalHours,
    overtimeHours,
    isOvertime,
    startTimer,
    resetTimerData
  };
};