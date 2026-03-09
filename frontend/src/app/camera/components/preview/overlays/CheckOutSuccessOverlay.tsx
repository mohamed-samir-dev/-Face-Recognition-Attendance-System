"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/components/dashboard/hooks/useAuth";
import { formatHoursForCard } from "@/lib/utils/timeFormatters";

interface CheckOutSuccessOverlayProps {
  checkOutData: {
    name: string;
    checkIn: string;
    checkOut: string;
    workedHours: number;
  };
}

export default function CheckOutSuccessOverlay({ checkOutData }: CheckOutSuccessOverlayProps) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const isSupervisor = user?.accountType === "Manager" || user?.accountType === "Supervisor";
    const redirectPath = isSupervisor ? "/supervisor" : "/userData";
    
    const timer = setTimeout(() => {
      router.push(redirectPath);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, user?.accountType]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="absolute inset-0 bg-white flex items-center justify-center p-4 sm:p-6">
      <div className="text-center max-w-md w-full">
        <div className="bg-green-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Check-Out Complete</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-2">Have a great day, {checkOutData.name}!</p>
        
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600 flex items-center gap-1 sm:gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              Check-in
            </span>
            <span className="font-semibold text-gray-900">{formatTime(checkOutData.checkIn)}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600 flex items-center gap-1 sm:gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              Check-out
            </span>
            <span className="font-semibold text-gray-900">{formatTime(checkOutData.checkOut)}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-900 font-medium">Total Hours</span>
              <span className="text-xl sm:text-2xl font-bold text-green-600">{formatHoursForCard(checkOutData.workedHours || 0)}</span>
            </div>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
