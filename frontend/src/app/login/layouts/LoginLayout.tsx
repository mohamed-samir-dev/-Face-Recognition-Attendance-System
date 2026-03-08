"use client";

import AppLogo from "@/components/layout/common/AppLogo";
import PageHeader from "@/components/layout/common/PageHeader";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 font-['Inter',sans-serif]">
      <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10">
        <AppLogo size="sm" />
      </div>

      <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg">
        <PageHeader 
          title="Welcome Back" 
          subtitle="Log in to mark your attendance." 
        />
        {children}
      </div>
    </div>
  );
}
