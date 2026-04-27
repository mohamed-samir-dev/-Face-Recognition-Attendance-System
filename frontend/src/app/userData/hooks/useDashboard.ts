import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/dashboard/hooks/useAuth";
import { validateNetworkAccess } from "@/lib/services/system/networkService";
import toast from "react-hot-toast";

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

  const [networkBlocked, setNetworkBlocked] = useState(false);
  const [blockedIp, setBlockedIp] = useState<string | null>(null);

  const checkNetworkAndProceed = async (path: string): Promise<boolean> => {
    const check = await validateNetworkAccess(user?.accountType);
    if (!check.allowed) {
      setBlockedIp(check.currentIp);
      setNetworkBlocked(true);
      toast.error("Access denied: You are not on an allowed network.");
      return false;
    }
    return true;
  };

  const handleTakeAttendance = async () => {
    if (await checkNetworkAndProceed("/camera?mode=checkin")) {
      router.push("/camera?mode=checkin");
    }
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

    if (!(await checkNetworkAndProceed("/camera?mode=checkout"))) {
      return;
    }

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
    networkBlocked,
    setNetworkBlocked,
    blockedIp,
  };
}
