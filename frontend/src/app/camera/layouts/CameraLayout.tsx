"use client";

import { useRouter } from "next/navigation";
import { useCamera } from "../hooks/useCamera";
import Navbar from "@/components/layout/navigation/Navbar";
import SupervisorNavbar from "@/components/supervisor/layout/SupervisorNavbar";
import NavigationBlocker from "@/components/NavigationBlocker";
import { CameraLayoutProps } from "../types";

export default function CameraLayout({ user, children }: CameraLayoutProps) {
  const { cameraActive, stopCamera } = useCamera();
  const router = useRouter();
  const isSupervisor = user?.accountType === "Manager" || user?.accountType === "Supervisor";

  const handleDashboardClick = () => {
    if (cameraActive) {
      stopCamera();
    }
    router.push(isSupervisor ? "/supervisor" : "/userData");
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] font-sans">
      <NavigationBlocker />
      {isSupervisor ? (
        <SupervisorNavbar
          user={user}
          onLogout={() => router.push("/login")}
          activeTab={null}
          onTabChange={() => handleDashboardClick()}
        />
      ) : (
        <Navbar
          user={user}
          showNavigation
          navigationItems={[
            {
              label: "Dashboard",
              href: "/userData",
              onClick: handleDashboardClick,
            },
            { label: "Reports", href: "#" },
          ]}
        />
      )}

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-3 sm:p-6 relative">
        {children}
      </div>
    </div>
  );
}
