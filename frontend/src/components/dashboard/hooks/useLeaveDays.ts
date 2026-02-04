import { useState, useEffect, useCallback } from "react";
import { getUserLeaveDays } from "@/lib/services/leave/leaveDaysService";
import { getCompanySettings } from "@/lib/services/system/settingsService";

export function useLeaveDays(employeeId: string | undefined) {
  const [leaveDays, setLeaveDays] = useState(0);
  const [vacationDays, setVacationDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const fetchLeaveDays = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const [days, settings] = await Promise.all([
        getUserLeaveDays(employeeId),
        getCompanySettings()
      ]);
      setLeaveDays(days);
      setVacationDays(settings.attendanceRules?.vacationDays || 30);
    } catch (error) {
      console.error("Error fetching leave days:", error);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchLeaveDays();
    
    const handleLeaveDaysUpdate = (event: CustomEvent) => {
      console.log('Leave days update event received:', event.detail);
      if (event.detail?.employeeId === employeeId) {
        console.log(`Refreshing leave days for employee ${employeeId}`);
        fetchLeaveDays();
      }
    };
    
    const handleLeaveRequestUpdate = () => {
      fetchLeaveDays();
    };
    
    window.addEventListener('leaveDaysUpdated', handleLeaveDaysUpdate as EventListener);
    window.addEventListener('leaveRequestUpdated', handleLeaveRequestUpdate);
    
    return () => {
      window.removeEventListener('leaveDaysUpdated', handleLeaveDaysUpdate as EventListener);
      window.removeEventListener('leaveRequestUpdated', handleLeaveRequestUpdate);
    };
  }, [fetchLeaveDays, employeeId]);

  return { leaveDays, vacationDays, loading, refetch: fetchLeaveDays };
}
