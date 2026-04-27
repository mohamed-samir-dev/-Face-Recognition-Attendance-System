import { useState, useEffect } from 'react';
import { getTimerData, startWorkTimer, resetTimer, calculateRemainingTime } from '@/lib/services/attendance/timerService';
import { resetTotalHours } from '@/lib/services/attendance/totalHoursService';
import { getCompanySettings } from '@/lib/services/system/settingsService';
import { getTodayOvertime } from '@/lib/services/attendance/overtimeService';

export const useWorkTimer = (userId?: string) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [baseTotalHours, setBaseTotalHours] = useState<number>(0);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [isOvertime, setIsOvertime] = useState(false);

  // Load & refresh total hours from totalHours collection
  useEffect(() => {
    if (!userId) return;

    let interval: NodeJS.Timeout;

    const loadTotalHours = async () => {
      const { getMonthlyTotalHours } = await import('@/lib/services/attendance/totalHoursService');
      const total = await getMonthlyTotalHours(userId);
      setBaseTotalHours(total);
    };

    const handleTimerCompleted = async () => {
      setIsActive(false);
      setTimeRemaining(0);
      // Small delay to let checkout save to collection first
      setTimeout(loadTotalHours, 500);
    };

    window.addEventListener('timerCompleted', handleTimerCompleted);
    loadTotalHours();
    interval = setInterval(loadTotalHours, 30000);

    return () => {
      window.removeEventListener('timerCompleted', handleTimerCompleted);
      clearInterval(interval);
    };
  }, [userId]);

  // Load timer state on mount
  useEffect(() => {
    if (!userId) return;

    const loadTimer = async () => {
      const timerData = await getTimerData(userId);
      if (timerData && timerData.checkInTime) {
        const newRemaining = await calculateRemainingTime(timerData);
        setTimeRemaining(newRemaining);
        setIsActive(timerData.active);

        const now = new Date();
        const settings = await getCompanySettings();
        const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);
        const currentlyOvertime = now.getTime() > workEnd.getTime();

        setIsOvertime(currentlyOvertime);
        if (currentlyOvertime) {
          setOvertimeHours((now.getTime() - workEnd.getTime()) / (1000 * 60 * 60));
        } else {
          const todayOt = await getTodayOvertime(userId);
          setOvertimeHours(todayOt);
        }
      }
    };

    loadTimer();

    const handleTimerStarted = () => setTimeout(loadTimer, 100);
    window.addEventListener('timerStarted', handleTimerStarted);
    return () => window.removeEventListener('timerStarted', handleTimerStarted);
  }, [userId]);

  // Countdown / overtime tick every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let lastOvertimeSave = 0;

    if (userId) {
      interval = setInterval(async () => {
        const timerData = await getTimerData(userId!);
        if (timerData && timerData.checkInTime && timerData.active) {
          const now = new Date();
          const settings = await getCompanySettings();
          const workEnd = new Date(`${now.toDateString()} ${settings.workingHours.endTime}:00`);

          if (now.getTime() <= workEnd.getTime()) {
            const newRemaining = await calculateRemainingTime(timerData);
            setTimeRemaining(newRemaining);
            setIsOvertime(false);
            setOvertimeHours(0);
          } else {
            const overtime = (now.getTime() - workEnd.getTime()) / (1000 * 60 * 60);
            setIsOvertime(true);
            setOvertimeHours(overtime);
            setTimeRemaining(0);

            // Save live overtime snapshot every 60s
            const nowMs = Date.now();
            if (nowMs - lastOvertimeSave >= 60000) {
              lastOvertimeSave = nowMs;
              const { saveOvertimeRecord } = await import('@/lib/services/attendance/overtimeService');
              const { doc: firestoreDoc, getDoc } = await import('firebase/firestore');
              const { db } = await import('@/lib/firebase/config');
              const userDoc = await getDoc(firestoreDoc(db, 'users', userId!));
              const userName = userDoc.exists() ? userDoc.data().name : 'Unknown';
              await saveOvertimeRecord(userId!, userName, overtime);
            }
          }
        } else {
          setIsActive(false);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [userId]);

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
    setBaseTotalHours(0);
  };

  return {
    timeRemaining: !isOvertime ? formatTime(timeRemaining) : '0:00:00',
    overtimeTimer: isOvertime ? formatOvertimeHours(overtimeHours) : undefined,
    isActive,
    totalHours: baseTotalHours,
    overtimeHours,
    isOvertime,
    startTimer,
    resetTimerData
  };
};
