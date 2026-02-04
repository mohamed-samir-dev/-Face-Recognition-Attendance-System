import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/dashboard/hooks/useAuth";

export function useDashboard() {
  const { user, mounted, logout, refreshUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.numericId === 1) {
      router.push("/admin");
    } else if (user && (user.accountType === "Manager" || user.accountType === "Supervisor")) {
      router.push("/supervisor");
    }
  }, [user, router]);

  useEffect(() => {
    if (mounted && user && refreshUserData) {
      refreshUserData();
    }
  }, [mounted, user, refreshUserData]);

  const handleTakeAttendance = () => {
    router.push("/camera?mode=checkin");
  };

  const handleRequestLeave = () => {
    router.push("/leaveRequest");
  };

  const handleSettings = () => {
    // This will be handled by tab navigation now
  };

  const handleReports = () => {
    // This will be handled by tab navigation now
  };

  const handleDashboard = () => {
    // This will be handled by tab navigation now
  };

  const handleCheckOut = async () => {
    if (!user) return;
    
    const { checkCanCheckOut } = await import('@/lib/services/attendance/checkoutService');
    const result = await checkCanCheckOut(user.id);
    
    if (result.canCheckOut) {
      router.push("/camera?mode=checkout");
    } else {
      return { canCheckOut: false, message: result.message };
    }
  };

  return {
    user,
    mounted,
    logout,
    handleTakeAttendance,
    handleCheckOut,
    handleRequestLeave,
    handleSettings,
    handleReports,
    handleDashboard,
  };
}
