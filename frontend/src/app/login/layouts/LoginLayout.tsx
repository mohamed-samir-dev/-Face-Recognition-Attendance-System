"use client";

import AppLogo from "@/components/layout/common/AppLogo";
import PageHeader from "@/components/layout/common/PageHeader";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 font-['Inter',sans-serif]">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <AppLogo size="sm" />
      </div>

      <div className="w-full max-w-lg">
        <PageHeader 
          title="Welcome Back" 
          subtitle="Log in to mark your attendance." 
        />
        {children}
      </div>
    </div>
  );
}
