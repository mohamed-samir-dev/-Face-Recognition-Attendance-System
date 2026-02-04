"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/dashboard/hooks/useAuth";
import { useLeaveRequests } from "@/components/admin/attendance/hooks/data/useLeaveRequests";
import { startLeaveStatusUpdater } from "@/lib/services/leave/leaveStatusUpdater";
import NavigationBlocker from "@/components/NavigationBlocker";
import AdminSidebar from "@/components/layout/admin/AdminSidebar";
import AdminTopBar from "@/components/layout/admin/AdminTopBar";
import ContentRenderer from "../renderer";
import LoadingSpinner from "../../ui/loading";

export default function AdminDashboardContent() {
  const { user, mounted, logout } = useAuth();
  const { leaveRequests, loading } = useLeaveRequests();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const cleanup = startLeaveStatusUpdater();
    return cleanup;
  }, []);

  if (!mounted || !user || user.numericId !== 1) {
    return null;
  }

  const pendingRequests = leaveRequests.filter(
    (req) => req.status === "Pending"
  );
  const pendingCount = pendingRequests.length;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      onClick={() => {
        if (showNotifications) setShowNotifications(false);
        if (sidebarOpen) setSidebarOpen(false);
      }}
    >
      <NavigationBlocker />

      <AdminSidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
          window.history.pushState({}, "", `/admin?tab=${tab}`);
        }}
        pendingCount={pendingCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-56">
        <AdminTopBar
          user={user}
          onLogout={logout}
          showNotifications={showNotifications}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
          pendingRequests={pendingRequests}
          onViewRequest={() => {
            setShowNotifications(false);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="p-4 lg:p-0">
          <ContentRenderer activeTab={activeTab} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
