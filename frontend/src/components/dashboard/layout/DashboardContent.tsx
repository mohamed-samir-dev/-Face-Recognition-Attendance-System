"use client";

import ProfileSection from "../profile/ProfileSection";
import AttendanceSummary from "../widgets/AttendanceSummary";
import AttendanceChart from "../charts/AttendanceChart";
import { DashboardContentProps } from "../types";
import { useAbsenceTracking } from "../hooks/useAbsenceTracking";
import { useMonthlyAttendanceStats } from "../hooks/useMonthlyAttendanceStats";
import { useAuth } from "../hooks/useAuth";
import { useMemo } from "react";

export default function DashboardContent({
  user,
  onTakeAttendance,
  onRequestLeave,
  onCheckOut
}: DashboardContentProps) {
  useAbsenceTracking();
  const { user: authUser } = useAuth();
  const { dailyData, monthlyData, monthlyDetails } = useMonthlyAttendanceStats(authUser?.id);

  const attendancePercentage = useMemo(() => {
    if (dailyData.length === 0) return 0;
    const presentDays = dailyData.filter(d => d.status === 100).length;
    return Math.round((presentDays / dailyData.length) * 100);
  }, [dailyData]);

  const monthlyPercentage = useMemo(() => {
    if (monthlyData.length === 0) return 0;
    const total = monthlyData.reduce((sum, m) => sum + m.attendance, 0);
    return Math.round(total / monthlyData.length);
  }, [monthlyData]);

  return (
    <div className="max-w-full mx-auto p-6">
      <ProfileSection 
        user={user}
        onTakePhoto={onTakeAttendance}
        onRequestLeave={onRequestLeave}
        onCheckOut={onCheckOut}
      />

      <AttendanceSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AttendanceChart 
          title="Attendance Trends"
          percentage={attendancePercentage}
          improvement={5}
          type="line"
          dailyData={dailyData}
        />
        <AttendanceChart 
          title="Monthly Performance"
          percentage={monthlyPercentage}
          improvement={10}
          type="bar"
          monthlyData={monthlyData}
          monthlyDetails={monthlyDetails}
        />
      </div>
    </div>
  );
}