"use client";

import AppLogo from "../../common/AppLogo";

interface NavbarHeaderProps {
  title: string;
}

export default function NavbarHeader({ title }: NavbarHeaderProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <AppLogo size="md" showText={false} />
      <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none">
        {title}
      </h1>
    </div>
  );
}