"use client";

import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNotifications } from "@/components/common/hooks/useNotifications";
import { markAsRead } from "@/lib/services/system/notificationService";
import Toast from "@/components/common/feedback/Toast";
import { NavbarProps } from "../types";
import { NavbarHeader, NotificationDropdown, UserAvatar, NavigationMenu } from "./navbar/index";

export default function Navbar({
  user,
  title = "Employee Attendance",
  onUserClick,
  showNavigation = false,
  navigationItems = [],
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
    isVisible: boolean;
  }>({ message: "", type: "success", isVisible: false });

  const { notifications } = useNotifications(user?.numericId?.toString() || "");
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const latestUnread = notifications.find((n) => !n.isRead);
    if (latestUnread) {
      const type = latestUnread.type === "leave_approved" ? "success" : "warning";
      setToast({ message: latestUnread.message, type, isVisible: true });
    }
  }, [notifications]);

  const handleNotificationToggle = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) {
      notifications.filter((n) => !n.isRead).forEach((n) => markAsRead(n.id));
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <NavbarHeader title={title} />

          {showNavigation && (
            <NavigationMenu
              navigationItems={navigationItems}
              isMenuOpen={isMenuOpen}
              onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
            />
          )}

          <div className="flex items-center space-x-2 sm:space-x-4">
            {user && (
              <>
                <NotificationDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  isOpen={isNotificationOpen}
                  onToggle={handleNotificationToggle}
                  onMarkAsRead={handleMarkAsRead}
                />
                <button
                  onClick={onUserClick}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <UserAvatar user={user} onUserClick={onUserClick || (() => {})} />
              </>
            )}
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        duration={3000}
      />
    </nav>
  );
}
