import DashboardContent from "@/components/admin/dashboard/content/DashboardContent";
import AttendanceContent from "@/components/admin/attendance/content/AttendanceContent";
import LeavesContent from "@/components/admin/attendance/content/LeavesContent";
import ReportsContent from "@/components/admin/reports/ReportsContent";
import UserManagementView from "@/components/admin/employee-management/views/UserManagementView";
import SettingsContent from "@/components/admin/settings/views/SettingsView";
import DepartmentsContent from "@/components/admin/departments/views/content/DepartmentsContent";

interface ContentRendererProps {
  activeTab: string;
  searchQuery: string;
}

export default function ContentRenderer({ activeTab, searchQuery }: ContentRendererProps) {
  switch (activeTab) {
    case "Dashboard":
      return <DashboardContent />;
    case "Attendance":
      return <AttendanceContent />;
    case "Leaves":
      return <LeavesContent searchQuery={searchQuery} />;
    case "Reports":
      return <ReportsContent />;
    case "UserManagement":
      return <UserManagementView />;
    case "Departments":
      return <DepartmentsContent />;
    case "Settings":
      return <SettingsContent />;
    default:
      return <DashboardContent />;
  }
}