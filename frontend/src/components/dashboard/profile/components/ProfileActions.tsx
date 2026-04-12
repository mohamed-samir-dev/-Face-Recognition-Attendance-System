import { Calendar, Camera, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getCompanySettings } from "@/lib/services/system/settingsService";

interface ProfileActionsProps {
  onRequestLeave?: () => void;
  onTakePhoto: () => void;
  onCheckOut?: () => void;
  userStatus?: string;
  leaveDaysTaken?: number;
  totalLeaveDays?: number;
}

function isWithinWorkingHours(startTime: string): boolean {
  const now = new Date();
  const [startH, startM] = startTime.split(":").map(Number);
  const current = now.getHours() * 60 + now.getMinutes();
  const start = startH * 60 + startM;
  return current >= start && current <= start + 180;
}

function isWithinCheckOutWindow(endTime: string): boolean {
  const now = new Date();
  const [endH, endM] = endTime.split(":").map(Number);
  const current = now.getHours() * 60 + now.getMinutes();
  const end = endH * 60 + endM;
  return current >= end - 120 && current <= end;
}

export default function ProfileActions({ onRequestLeave, onTakePhoto, onCheckOut, userStatus, leaveDaysTaken = 0, totalLeaveDays = 30 }: ProfileActionsProps) {
  const isOnLeave = userStatus === "OnLeave";
  const isLeaveExhausted = leaveDaysTaken >= totalLeaveDays;
  const [workingHours, setWorkingHours] = useState<{ startTime: string; endTime: string } | null>(null);

  useEffect(() => {
    getCompanySettings().then(s => setWorkingHours(s.workingHours));
  }, []);

  const isOutsideWorkingHours = workingHours ? !isWithinWorkingHours(workingHours.startTime) : false;
  const isOutsideCheckOutWindow = workingHours ? !isWithinCheckOutWindow(workingHours.endTime) : false;

  const handleCheckOutClick = () => {
    if (isOutsideCheckOutWindow && workingHours) {
      toast.error(`Check Out is only available 2 hours before end time (${workingHours.endTime}).`, {
        duration: 4000,
        style: { maxWidth: "500px" }
      });
      return;
    }
    onCheckOut?.();
  };

  const handleAttendanceClick = () => {
    if (isOnLeave) {
      toast.error("You are currently on approved leave. Attendance registration is not permitted during this period.", {
        duration: 4000,
        style: { maxWidth: "500px" }
      });
      return;
    }
    if (isOutsideWorkingHours && workingHours) {
      toast.error(`Attendance is only allowed within 3 hours after ${workingHours.startTime}.`, {
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
          disabled={isOnLeave || isOutsideWorkingHours}
          className={`w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 ${
            isOnLeave || isOutsideWorkingHours
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-[#2563EB] cursor-pointer text-white hover:bg-blue-700"
          }`}
        >
          <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="whitespace-nowrap">Taking attendance</span>
        </button>
        {isOutsideWorkingHours && workingHours && (
          <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
          Available from {workingHours.startTime} (3 hours only)
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
      {onCheckOut && (
        <div className="relative group w-full sm:w-auto">
          <button
            onClick={handleCheckOutClick}
            disabled={isOutsideCheckOutWindow}
            className={`w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 ${
              isOutsideCheckOutWindow
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-red-600 cursor-pointer text-white hover:bg-red-700"
            }`}
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Check Out</span>
          </button>
          {isOutsideCheckOutWindow && workingHours && (
            <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              Available 2 hours before {workingHours.endTime}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}