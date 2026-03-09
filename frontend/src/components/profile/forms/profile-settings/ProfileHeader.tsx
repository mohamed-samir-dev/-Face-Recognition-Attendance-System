import React from "react";

export default function ProfileHeader() {
  return (
    <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
      <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
        Profile Settings
      </h1>
      <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base">
        Manage your personal information and preferences
      </p>
    </div>
  );
}