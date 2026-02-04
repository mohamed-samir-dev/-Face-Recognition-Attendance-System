"use client";

import Card from "@/components/common/cards/Card";

interface CameraLayoutProps {
  children: React.ReactNode;
}

export default function CameraLayout({ children }: CameraLayoutProps) {
  return (
    <Card className="w-full max-w-md sm:max-w-lg lg:max-w-2xl">
      {children}
    </Card>
  );
}