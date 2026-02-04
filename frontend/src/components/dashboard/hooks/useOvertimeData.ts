import { useState, useEffect } from 'react';
import { getMonthlyOvertime, getTodayOvertime } from '@/lib/services/attendance/overtimeService';

export const useOvertimeData = (userId?: string) => {
  const [monthlyOvertime, setMonthlyOvertime] = useState<number>(0);
  const [todayOvertime, setTodayOvertime] = useState<number>(0);

  useEffect(() => {
    if (!userId) return;

    const loadOvertimeData = async () => {
      try {
        const [monthly, today] = await Promise.all([
          getMonthlyOvertime(userId),
          getTodayOvertime(userId)
        ]);
        
        setMonthlyOvertime(monthly);
        setTodayOvertime(today);
      } catch (error) {
        console.error('Error loading overtime data:', error);
        setMonthlyOvertime(0);
        setTodayOvertime(0);
      }
    };

    loadOvertimeData();
  }, [userId]);

  return {
    monthlyOvertime,
    todayOvertime
  };
};