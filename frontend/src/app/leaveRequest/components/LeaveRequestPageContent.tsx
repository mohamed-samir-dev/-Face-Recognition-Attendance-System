"use client";

import { useAuth } from "@/components/dashboard/hooks/useAuth";
import { useLeaveRequest } from "../hooks/useLeaveRequest";
import { useRouter } from "next/navigation";
import LeaveRequestLayout from "@/components/leave/layouts/LeaveRequestLayout";
import SupervisorNavbar from "@/components/supervisor/layout/SupervisorNavbar";
import NavigationBlocker from "@/components/NavigationBlocker";
import Toast from "@/components/common/feedback/Toast";
import LeaveRequestForm from "@/components/leave/forms/LeaveRequestForm";

export default function LeaveRequestPageContent() {
  const { user, mounted, logout } = useAuth();
  const {
    formData,
    isSubmitting,
    disabled,
    toast,
    dateError,
    leaveWarning,
    leaveDaysTaken,
    allowedLeaveDays,
    handleChange,
    handleSubmit,
    closeToast,
  } = useLeaveRequest();
  const router = useRouter();

  if (!mounted || !user) {
    return null;
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const redirectPath = isSupervisor ? "/supervisor" : "/userData";
    handleSubmit(e, user.id, user.name, user.numericId, redirectPath);
  };

  const isSupervisor = user.accountType === "Manager" || user.accountType === "Supervisor";
  
  const onCancel = () => {
    router.push(isSupervisor ? "/supervisor" : "/userData");
  };

  if (isSupervisor) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-['Inter',sans-serif]">
        <NavigationBlocker />
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={closeToast}
        />
        <SupervisorNavbar
          user={user}
          onLogout={logout}
          activeTab={null}
          onTabChange={() => router.push("/supervisor")}
        />
        <div className="max-w-full mx-auto p-3 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <LeaveRequestForm
              user={user}
              formData={formData}
              isSubmitting={isSubmitting}
              disabled={disabled}
              dateError={dateError}
              leaveWarning={leaveWarning}
              leaveDaysTaken={leaveDaysTaken}
              allowedLeaveDays={allowedLeaveDays}
              onSubmit={onSubmit}
              onChange={handleChange}
              onCancel={onCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <LeaveRequestLayout
      user={user}
      toast={toast}
      onCloseToast={closeToast}
      onLogout={logout}
    >
      <LeaveRequestForm
        user={user}
        formData={formData}
        isSubmitting={isSubmitting}
        disabled={disabled}
        dateError={dateError}
        leaveWarning={leaveWarning}
        leaveDaysTaken={leaveDaysTaken}
        allowedLeaveDays={allowedLeaveDays}
        onSubmit={onSubmit}
        onChange={handleChange}
        onCancel={onCancel}
      />
    </LeaveRequestLayout>
  );
}
