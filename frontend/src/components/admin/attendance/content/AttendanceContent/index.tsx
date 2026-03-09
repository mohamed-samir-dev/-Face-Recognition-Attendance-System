"use client";

import { getAllAttendanceHistory } from "@/lib/services/attendance/adminAttendanceService";
import AttendanceTableView from "@/components/supervisor/attendance/SupervisorAttendance";

export default function AttendanceContent() {
  return (
    <AttendanceTableView
      fetchData={getAllAttendanceHistory}
      title="Supervisors Attendance"
      subtitle="Monitor all supervisors attendance records"
    />
  );
}
