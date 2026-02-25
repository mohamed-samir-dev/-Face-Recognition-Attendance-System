"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "../hooks/useDashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardContent from "@/components/dashboard/layout/DashboardContent";
import AttendanceWarningModal from "./AttendanceWarningModal";
import { ProfileSettingsForm } from "@/components/profile/forms";
import EmployeeReport from "@/components/dashboard/reports/EmployeeReport";

export default function DashboardPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showCheckOutWarning, setShowCheckOutWarning] = useState(false);
  const [checkOutMessage, setCheckOutMessage] = useState("");
  const {
    user,
    mounted,
    logout,
    handleTakeAttendance,
    handleCheckOut,
    handleRequestLeave,
  } = useDashboard();

  useEffect(() => {
    const tab = searchParams.get("tab");
    setActiveTab(tab);
    if (searchParams.get("showAttendanceWarning") === "true") {
      setShowWarning(true);
    }
  }, [searchParams]);

  if (!mounted || !user) {
    return null;
  }

  if (user && user.numericId === 1) {
    return null;
  }

  const handleCloseWarning = () => {
    setShowWarning(false);
    window.history.replaceState({}, "", "/userData");
  };

  const handleTabChange = (tab: string | null) => {
    setActiveTab(tab);
    if (tab) {
      window.history.pushState({}, "", `/userData?tab=${tab}`);
    } else {
      window.history.pushState({}, "", `/userData`);
    }
  };

  const handleCheckOutClick = async () => {
    const result = await handleCheckOut();
    if (result && !result.canCheckOut) {
      setCheckOutMessage(result.message);
      setShowCheckOutWarning(true);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "settings":
        return (
          <div className="p-6">
            <ProfileSettingsForm user={user} />
          </div>
        );
      case "reports":
        return <EmployeeReport />;
      default:
        return (
          <DashboardContent
            user={user}
            onTakeAttendance={handleTakeAttendance}
            onCheckOut={handleCheckOutClick}
            onRequestLeave={handleRequestLeave}
          />
        );
    }
  };

  return (
    <>
      <DashboardLayout
        user={user}
        onLogout={logout}
        onDashboard={() => handleTabChange(null)}
        onReports={() => handleTabChange("reports")}
        onSettings={() => handleTabChange("settings")}
      >
        {renderTabContent()}
      </DashboardLayout>

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
