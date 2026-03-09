"use client";

import AppLogo from "../../common/AppLogo";

interface NavbarHeaderProps {
  title: string;
}

export default function NavbarHeader({ title }: NavbarHeaderProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0 min-w-0">
      <AppLogo size="md" showText={false} />
      <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-900 truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[150px] md:max-w-none">
        {title}
      </h1>
    </div>
  );
}