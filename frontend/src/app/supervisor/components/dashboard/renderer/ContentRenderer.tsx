"use client";

import { User } from "@/lib/types";
import SupervisorUserManagementView from "@/components/supervisor/employee-management/views/SupervisorUserManagementView";
import SupervisorAttendance from "@/components/supervisor/attendance/SupervisorAttendance";
import SupervisorLeaves from "@/components/supervisor/leaves/SupervisorLeaves";
import ProfileSettingsForm from "@/components/profile/forms/ProfileSettingsForm";
import SupervisorReport from "@/components/dashboard/reports/SupervisorReport";

interface ContentRendererProps {
  activeTab: string;
  user: User;
}

export default function ContentRenderer({ activeTab, user }: ContentRendererProps) {
  switch (activeTab) {
    case "UserManagement":
      return <SupervisorUserManagementView user={user} />;
    case "Attendance":
      return <SupervisorAttendance user={user} />;
    case "Leaves":
      return <SupervisorLeaves user={user} />;
    case "Reports":
      return <SupervisorReport />;
    case "Settings":
      return (
        <div className="p-6">
          <ProfileSettingsForm user={user} />
        </div>
      );
    default:
      return null;
  }
}
