"use client";

import { User as UserType } from "@/lib/types";
import { getSupervisorTeamAttendance } from "@/lib/services/attendance/supervisorAttendanceService";
import AttendanceTableView from "./SupervisorAttendance";

interface SupervisorAttendanceWrapperProps {
  user: UserType;
}

export default function SupervisorAttendanceWrapper({ user }: SupervisorAttendanceWrapperProps) {
  return (
    <AttendanceTableView
      fetchData={() => getSupervisorTeamAttendance(user.id)}
      title="Team Attendance"
      subtitle="Monitor your team's attendance records"
    />
  );
}
