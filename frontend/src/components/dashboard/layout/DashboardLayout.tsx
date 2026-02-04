"use client";

import Navbar from "@/components/layout/navigation/Navbar";
import NavigationBlocker from "@/components/NavigationBlocker";
import { DashboardLayoutProps } from "../types";

export default function DashboardLayout({
  user,
  onLogout,
  onDashboard,
  onReports,
  onSettings,
  children
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter',sans-serif]">
      <NavigationBlocker />
      <Navbar 
        user={user}
        title="Attendance Tracker"
        onUserClick={onLogout}
        showNavigation
        navigationItems={[
          { label: "Dashboard", href: "", onClick: onDashboard },
          { label: "Reports", href: "", onClick: onReports },
          { label: "Settings", href: "", onClick: onSettings }
        ]}
      />
      {children}
    </div>
  );
}