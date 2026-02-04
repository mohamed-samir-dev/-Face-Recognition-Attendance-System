"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/types";
import { useNotifications } from "@/components/common/hooks/useNotifications";
import { markAsRead } from "@/lib/services/system/notificationService";
import Toast from "@/components/common/feedback/Toast";
import NotificationDropdown from "@/components/layout/navigation/navbar/NotificationDropdown";
import UserAvatar from "@/components/layout/navigation/navbar/UserAvatar";
import { usePendingLeaveRequests } from "../leaves/usePendingLeaveRequests";
// 
interface SupervisorNavbarProps {
  user: User;
  onLogout: () => void;
  activeTab: string | null;
  onTabChange: (tab: string | null) => void;
}

export default function SupervisorNavbar({ user, onLogout, activeTab, onTabChange }: SupervisorNavbarProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
    isVisible: boolean;
  }>({ message: "", type: "success", isVisible: false });

  const { notifications } = useNotifications(user?.numericId?.toString() || "");
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const pendingLeaveCount = usePendingLeaveRequests(user?.id || "");

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

  const navItems = [
    { id: null, label: "Dashboard", onClick: () => onTabChange(null) },
    { id: "UserManagement", label: "User Management" },
    { id: "Attendance", label: "Attendance" },
    { id: "Leaves", label: "Leaves" },
    { id: "Reports", label: "Reports" },
    { id: "Settings", label: "Settings" },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Attendance Tracker</h1>
            
            <div className="hidden md:flex space-x-1 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item, index) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={index}
                    onClick={() => item.onClick ? item.onClick() : onTabChange(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.id === "Leaves" && pendingLeaveCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {pendingLeaveCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                isOpen={isNotificationOpen}
                onToggle={handleNotificationToggle}
                onMarkAsRead={handleMarkAsRead}
              />
              <UserAvatar user={user} onUserClick={onLogout} />
            </div>
          </div>
        </div>
      </nav>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        duration={3000}
      />
    </>
  );
}
