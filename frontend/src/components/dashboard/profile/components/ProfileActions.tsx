import { Calendar, Camera, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getCompanySettings } from "@/lib/services/system/settingsService";
import { Holiday } from "@/components/admin/settings/types";

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function isTodayWeekend(weekendDays: string[]): boolean {
  return weekendDays.includes(DAY_NAMES[new Date().getDay()]);
}

function isTodayHoliday(holidays: Holiday[]): Holiday | null {
  const today = new Date().toISOString().split('T')[0];
  return holidays.find(h => {
    if (h.endDate) return today >= h.date && today <= h.endDate;
    return h.date === today;
  }) || null;
}

interface ProfileActionsProps {
  onRequestLeave?: () => void;
  onTakePhoto: () => void;
  onCheckOut?: () => void;
  userStatus?: string;
  leaveDaysTaken?: number;
  totalLeaveDays?: number;
}

export default function ProfileActions({ onRequestLeave, onTakePhoto, onCheckOut, userStatus, leaveDaysTaken = 0, totalLeaveDays = 30 }: ProfileActionsProps) {
  const isOnLeave = userStatus === "OnLeave";
  const isLeaveExhausted = leaveDaysTaken >= totalLeaveDays;
  const [isDayOff, setIsDayOff] = useState(false);
  const [dayOffReason, setDayOffReason] = useState('');

  useEffect(() => {
    getCompanySettings().then(s => {
      const weekendDays = s.weekendDays || ['Friday', 'Saturday'];
      if (isTodayWeekend(weekendDays)) {
        setIsDayOff(true);
        setDayOffReason('Today is a weekend');
      } else {
        const holiday = isTodayHoliday(s.holidays || []);
        if (holiday) {
          setIsDayOff(true);
          setDayOffReason(`Holiday: ${holiday.name}`);
        }
      }
    });
  }, []);

  const handleCheckOutClick = () => {
    if (isDayOff) {
      toast.error(`${dayOffReason}. Check Out is not available.`, { duration: 4000, style: { maxWidth: "500px" } });
      return;
    }
    onCheckOut?.();
  };

  const handleAttendanceClick = () => {
    if (isDayOff) {
      toast.error(`${dayOffReason}. Attendance is not available today.`, { duration: 4000, style: { maxWidth: "500px" } });
      return;
    }
    if (isOnLeave) {
      toast.error("You are currently on approved leave. Attendance registration is not permitted during this period.", {
        duration: 4000,
        style: { maxWidth: "500px" }
      });
      return;
    }
    onTakePhoto();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
      {onRequestLeave && (
        <div className="relative group w-full sm:w-auto">
          <button
            onClick={isOnLeave || isLeaveExhausted ? undefined : onRequestLeave}
            disabled={isOnLeave || isLeaveExhausted}
            className={`w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 ${
              isOnLeave || isLeaveExhausted
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#2563EB] cursor-pointer text-white hover:bg-blue-700"
            }`}
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Request Leave</span>
          </button>
          {(isLeaveExhausted || isOnLeave) && (
            <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Not Allowed
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>
      )}
      <div className="relative group w-full sm:w-auto">
        <button
          onClick={handleAttendanceClick}
          disabled={isOnLeave || isDayOff}
          className={`w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 ${
            isOnLeave || isDayOff
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-[#2563EB] cursor-pointer text-white hover:bg-blue-700"
          }`}
        >
          <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="whitespace-nowrap">Taking attendance</span>
        </button>
        {isDayOff && (
          <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            {dayOffReason}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
      {onCheckOut && (
        <div className="relative group w-full sm:w-auto">
          <button
            onClick={handleCheckOutClick}
            disabled={isDayOff}
            className={`w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 ${
              isDayOff
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-red-600 cursor-pointer text-white hover:bg-red-700"
            }`}
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Check Out</span>
          </button>
          {isDayOff && (
            <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {dayOffReason}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}