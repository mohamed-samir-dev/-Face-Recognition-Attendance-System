"use client";

import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
  onMenuClick: () => void;
}

export default function MobileMenuButton({ onMenuClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onMenuClick}
      className="lg:hidden p-2 rounded-md hover:bg-gray-100"
    >
      <Menu className="w-5 h-5 text-gray-600" />
    </button>
  );
}