"use client";

import { AdminTopBarProps } from "../types";
import { SearchBar, NotificationBell, UserProfile, MobileMenuButton } from "./topbar";

export default function AdminTopBar({
  user,
  onLogout,
  showNotifications,
  onToggleNotifications,
  pendingRequests,
  onViewRequest,
  searchQuery,
  onSearchChange,
  onMenuClick,
}: AdminTopBarProps) {
  const pendingCount = pendingRequests.length;

  return (
    <div className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center space-x-4 flex-1">
        <MobileMenuButton onMenuClick={onMenuClick} />
        <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <NotificationBell
          pendingCount={pendingCount}
          showNotifications={showNotifications}
          onToggleNotifications={onToggleNotifications}
          pendingRequests={pendingRequests}
          onViewRequest={onViewRequest}
        />
        <UserProfile user={user} onLogout={onLogout} />
      </div>
    </div>
  );
}
