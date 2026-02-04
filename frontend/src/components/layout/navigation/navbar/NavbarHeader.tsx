"use client";

import AppLogo from "../../common/AppLogo";

interface NavbarHeaderProps {
  title: string;
}

export default function NavbarHeader({ title }: NavbarHeaderProps) {
  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      <AppLogo size="md" showText={false} />
      <h1 className="text-base sm:text-lg font-semibold text-[#1A1A1A] truncate">
        {title}
      </h1>
    </div>
  );
}