"use client";

import ProfileSection from "../profile/ProfileSection";
import AttendanceSummary from "../widgets/AttendanceSummary";
import AttendanceChart from "../charts/AttendanceChart";
import { DashboardContentProps } from "../types";
import { useAbsenceTracking } from "../hooks/useAbsenceTracking";

export default function DashboardContent({
  user,
  onTakeAttendance,
  onRequestLeave,
  onCheckOut
}: DashboardContentProps) {
  // Initialize absence tracking service
  useAbsenceTracking();

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
          percentage={95}
          improvement={5}
          type="line"
        />
        <AttendanceChart 
          title="Monthly Performance"
          percentage={85}
          improvement={10}
          type="bar"
        />
      </div>
    </div>
  );
}