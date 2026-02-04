"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/dashboard/hooks/useAuth";
import NavigationBlocker from "@/components/NavigationBlocker";
import DashboardContent from "@/components/dashboard/layout/DashboardContent";
import SupervisorNavbar from "@/components/supervisor/layout/SupervisorNavbar";
import ContentRenderer from "../renderer";
import AttendanceWarningModal from "@/app/userData/components/AttendanceWarningModal";

export default function SupervisorDashboardContent() {
  const { user, mounted, logout } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [showCheckOutWarning, setShowCheckOutWarning] = useState(false);
  const [checkOutMessage, setCheckOutMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    setActiveTab(tab);
    if (searchParams.get("showAttendanceWarning") === "true") {
      setShowWarning(true);
    }
  }, [searchParams]);

  const handleCloseWarning = () => {
    setShowWarning(false);
    window.history.replaceState({}, "", "/supervisor");
  };

  if (!mounted || !user || (user.accountType !== "Manager" && user.accountType !== "Supervisor")) {
    return null;
  }

  const handleTabChange = (tab: string | null) => {
    setActiveTab(tab);
    if (tab) {
      window.history.pushState({}, "", `/supervisor?tab=${tab}`);
    } else {
      window.history.pushState({}, "", `/supervisor`);
    }
  };

  const handleCheckOut = async () => {
    const { checkCanCheckOut } = await import('@/lib/services/attendance/checkoutService');
    const result = await checkCanCheckOut(user.id);
    
    if (result.canCheckOut) {
      window.location.href = "/camera?mode=checkout";
    } else {
      setCheckOutMessage(result.message);
      setShowCheckOutWarning(true);
    }
  };

  if (activeTab) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBlocker />
        <SupervisorNavbar
          user={user}
          onLogout={logout}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <ContentRenderer activeTab={activeTab} user={user} />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] font-['Inter',sans-serif]">
        <NavigationBlocker />
        <SupervisorNavbar
          user={user}
          onLogout={logout}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <DashboardContent
          user={user}
          onTakeAttendance={() => window.location.href = "/camera?mode=checkin"}
          onCheckOut={handleCheckOut}
          onRequestLeave={() => window.location.href = "/leaveRequest"}
        />
      </div>

      <AttendanceWarningModal
        showWarning={showWarning}
        onClose={handleCloseWarning}
      />

      {showCheckOutWarning && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cannot Check Out</h3>
              <p className="text-gray-600 mb-6">{checkOutMessage}</p>
              <button
                onClick={() => setShowCheckOutWarning(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
