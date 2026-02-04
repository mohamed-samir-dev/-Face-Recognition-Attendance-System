"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/dashboard/hooks/useAuth";
import NavigationBlocker from "@/components/NavigationBlocker";
import SupervisorNavbar from "@/components/supervisor/layout/SupervisorNavbar";
import EditEmployeeForm from "@/components/admin/employee-management/forms/employee-forms/edit-employee-form/EditEmployeeForm";

export default function SupervisorEditEmployeePage() {
  const router = useRouter();
  const { user, mounted, logout } = useAuth();

  const handleTabChange = (tab: string | null) => {
    if (tab) {
      router.push(`/supervisor?tab=${tab}`);
    } else {
      router.push(`/supervisor`);
    }
  };

  if (!mounted || !user || user.accountType !== "Supervisor") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBlocker />
      <SupervisorNavbar
        user={user}
        onLogout={logout}
        activeTab="UserManagement"
        onTabChange={handleTabChange}
      />
      <EditEmployeeForm />
    </div>
  );
}
