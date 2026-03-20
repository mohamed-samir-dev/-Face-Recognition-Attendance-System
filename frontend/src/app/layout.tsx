import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBlocker from "../components/NavigationBlocker";
import StatusScheduler from "../components/StatusScheduler";
import { MonitoringScheduler } from "../components/common/monitoring";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntelliAttend - AI-Powered Attendance System",
  description: "AI-powered face recognition attendance management system for modern organizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <NavigationBlocker />
        <StatusScheduler />
        <MonitoringScheduler />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
