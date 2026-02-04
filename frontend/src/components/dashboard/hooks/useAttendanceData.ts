import { useState, useEffect } from "react";
import { useAuth } from "@/components/dashboard/hooks/useAuth";
import { useLeaveDays } from "@/components/dashboard/hooks/useLeaveDays";
import { useWorkTimer } from "@/components/dashboard/hooks/useWorkTimer";
import { useOvertimeData } from "@/components/dashboard/hooks/useOvertimeData";
import { getMonthlyLateArrivals } from "@/lib/services/attendance/attendanceService";
import { AttendanceData } from "../types";

export function useAttendanceData() {
  const { user } = useAuth();
  const { leaveDays, vacationDays } = useLeaveDays(user?.numericId?.toString());
  const { timeRemaining, overtimeTimer, isActive, totalHours, isOvertime } = useWorkTimer(user?.id);
  const { monthlyOvertime } = useOvertimeData(user?.id);
  const [lateArrivals, setLateArrivals] = useState<number>(0);

  useEffect(() => {
    if (user?.id) {
      getMonthlyLateArrivals(user.id).then(setLateArrivals);
    }
  }, [user?.id]);

  const data: AttendanceData = {
    totalHours,
    lateArrivals,
    leaveDays: `${leaveDays} / ${vacationDays}`,
    timeRemaining: isActive && !isOvertime ? timeRemaining : undefined,
    overtimeTimer: isActive && isOvertime ? overtimeTimer : undefined,
    overtimeHours: monthlyOvertime,
    isActive,
    isOvertime,
  };

  return data;
}
