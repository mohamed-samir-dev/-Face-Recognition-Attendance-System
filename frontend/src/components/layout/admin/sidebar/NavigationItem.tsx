"use client";

import {NavigationItemProps}from "../../types"

export default function NavigationItem({
  id,
  label,
  icon: Icon,
  badge,
  isActive,
  onClick,
}: NavigationItemProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </div>
      {badge && badge > 0 && (
        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}