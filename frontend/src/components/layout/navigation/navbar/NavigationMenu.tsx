"use client";

import { Menu, X, LayoutDashboard, FileText, Settings, Bell, LogOut, User, LucideIcon } from "lucide-react";
import {NavigationMenuProps}from "../../types"
import Image from "next/image";

const iconMap: Record<string, LucideIcon> = {
  Dashboard: LayoutDashboard,
  Reports: FileText,
  Settings: Settings,
};

export default function NavigationMenu({
  navigationItems,
  isMenuOpen,
  onToggleMenu,
  user,
  notifications,
  unreadCount,
  onLogout,
}: NavigationMenuProps) {
  const isBase64Image = user?.image?.startsWith('data:image');
  const isEncoding = user?.image && !isBase64Image && user.image.length > 100 && !user.image.startsWith('http');
  const displayImage = isEncoding ? '/default-avatar.png' : user?.image;

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2">
        {navigationItems.map((item, index) => {
          const Icon = iconMap[item.label];
          return (
            <button
              key={index}
              onClick={item.onClick}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all"
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={onToggleMenu}
        className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all relative"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        {(unreadCount ?? 0) > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 rounded-full h-2 w-2"></span>
        )}
      </button>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-14 sm:top-16 left-0 right-0 md:hidden bg-white border-t border-b border-gray-200 shadow-lg z-50">
          {/* User Profile Section */}
          <div className="px-4 py-4 border-b border-gray-100 bg-linear-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={user?.name || 'User'}
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
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-sm text-gray-600">ID: {user?.numericId}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="py-2">
            {navigationItems.map((item, index) => {
              const Icon = iconMap[item.label];
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    onToggleMenu();
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all"
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Notifications Section */}
          <div className="border-t border-gray-100">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Notifications</span>
                </div>
                {(unreadCount ?? 0) > 0 && (
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

          {/* Logout Button */}
          <div className="border-t border-gray-100 p-3">
            <button
              onClick={() => {
                onLogout?.();
                onToggleMenu();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}