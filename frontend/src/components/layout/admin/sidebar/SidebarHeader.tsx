"use client";

import { Shield } from "lucide-react";

interface SidebarHeaderProps {
  onClose: () => void;
}

export default function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
      </div>
      <button
        onClick={onClose}
        className="lg:hidden p-1 rounded-md hover:bg-gray-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}