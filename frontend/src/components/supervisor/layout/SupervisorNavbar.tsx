"use client";

import { useState, useEffect } from "react";
import { LogOut, Menu, X, LayoutDashboard, Users, Calendar, FileText, Settings, Bell } from "lucide-react";
import { User } from "@/lib/types";
import { useNotifications } from "@/components/common/hooks/useNotifications";
import { markAsRead } from "@/lib/services/system/notificationService";
import Toast from "@/components/common/toasts/Toast";
import { NavbarHeader, NotificationDropdown, UserAvatar } from "@/components/layout/navigation/navbar/index";
import { usePendingLeaveRequests } from "../leaves/usePendingLeaveRequests";
import Image from "next/image";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard,
  UserManagement: Users,
  Attendance: Calendar,
  Leaves: FileText,
  Reports: FileText,
  Settings: Settings,
};

interface SupervisorNavbarProps {
  user: User;
  onLogout: () => void;
  activeTab: string | null;
  onTabChange: (tab: string | null) => void;
}

export default function SupervisorNavbar({ user, onLogout, activeTab, onTabChange }: SupervisorNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <nav className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="max-w-full mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-2">
          <NavbarHeader title="Attendance Tracker" />
            
          <div className="hidden xl:flex space-x-1 absolute left-1/2 transform -translate-x-1/2">
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

          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3">
            <div className="hidden xl:flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3">
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                isOpen={isNotificationOpen}
                onToggle={handleNotificationToggle}
                onMarkAsRead={handleMarkAsRead}
              />
              <button
                onClick={onLogout}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <UserAvatar user={user} onUserClick={onLogout} />
            </div>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all relative shrink-0"
            >
              {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 rounded-full h-2 w-2"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-14 sm:top-16 left-0 right-0 xl:hidden bg-white border-t border-b border-gray-200 shadow-lg z-50">
          <div className="px-4 py-4 border-b border-gray-100 bg-linear-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.src = '/default-avatar.png';
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-white font-bold text-lg">{user?.name?.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-sm text-gray-600">ID: {user?.numericId}</p>
              </div>
            </div>
          </div>

          <div className="py-2">
            {navItems.map((item, index) => {
              const Icon = iconMap[item.id || 'Dashboard'];
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      onTabChange(item.id);
                    }
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 font-medium transition-all ${
                    activeTab === item.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className="flex-1">{item.label}</span>
                  {item.id === "Leaves" && pendingLeaveCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {pendingLeaveCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-100">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {notifications && notifications.length > 0 ? (
                  notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-2 rounded-lg text-sm ${
                        !notification.isRead ? "bg-blue-50 border border-blue-100" : "bg-gray-50"
                      }`}
                    >
                      <p className="text-gray-700 text-xs">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">No notifications</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-3">
            <button
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

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
