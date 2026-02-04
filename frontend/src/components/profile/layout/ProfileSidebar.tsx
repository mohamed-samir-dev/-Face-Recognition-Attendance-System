import { ProfileSidebarProps } from "../types";
import { useUserSession } from "../hooks/useUserSession";
import { useTimerData } from "../../dashboard/hooks/useTimerData";
import { WorkingHours } from '@/components/admin';
import { TimerInfo } from "../../dashboard/types";
import { useEffect, useState } from 'react';
import { formatHoursForCard } from "@/lib/utils/timeFormatters";

interface TimerCardProps {
  timerInfo: TimerInfo;
  workingHours: WorkingHours;
}

function TimerCard({ timerInfo, workingHours }: TimerCardProps) {
  const [currentRemainingMs, setCurrentRemainingMs] = useState(timerInfo.remainingMs);
  const [totalHoursWorked, setTotalHoursWorked] = useState(timerInfo.elapsedHours);
  const [currentSessionHours, setCurrentSessionHours] = useState(0);

  useEffect(() => {
    setCurrentRemainingMs(timerInfo.remainingMs);
    setTotalHoursWorked(timerInfo.elapsedHours);
  }, [timerInfo.remainingMs, timerInfo.elapsedHours]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const workEnd = new Date(`${now.toDateString()} ${workingHours.endTime}:00`);
      const remaining = Math.max(0, workEnd.getTime() - now.getTime());
      
      if (timerInfo.checkInTime && timerInfo.isActive) {
        const checkInTime = new Date(`${now.toDateString()} ${timerInfo.checkInTime}`);
        const currentSession = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        setCurrentSessionHours(currentSession);
        
        if (remaining === 0 && currentSession > 0) {
          setTotalHoursWorked(prev => prev + currentSession);
          setCurrentSessionHours(0);
        }
      }
      
      setCurrentRemainingMs(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [workingHours.endTime, timerInfo.checkInTime, timerInfo.isActive]);

  const calculateExpectedEndTime = () => {
    if (!timerInfo.checkInTime || !workingHours.endTime) return 'N/A';
    
    const today = new Date().toDateString();
    const endTime = new Date(`${today} ${workingHours.endTime}:00`);
    return endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatRemainingTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">Check-in Time:</span>
        <span className="text-xs font-medium text-gray-500">{timerInfo.checkInTime}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">Expected End:</span>
        <span className="text-xs font-medium text-gray-500">{calculateExpectedEndTime()}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">Total Hours:</span>
        <span className="text-xs font-medium text-gray-500">{formatHoursForCard(totalHoursWorked)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">Current Session:</span>
        <span className="text-xs font-medium text-blue-500">{formatHoursForCard(currentSessionHours)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">Hours Remaining:</span>
        <span className="text-xs font-medium text-blue-600">{formatRemainingTime(currentRemainingMs)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">Status:</span>
        <span className={`text-xs font-medium ${timerInfo.isActive ? 'text-green-600' : 'text-gray-500'}`}>
          {timerInfo.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">Working Hours:</span>
        <span className="text-xs font-medium text-gray-500">{workingHours.startTime} - {workingHours.endTime}</span>
      </div>
    </div>
  );
}

function TimerDetailsSection() {
  const { timerInfo, workingHours, loading } = useTimerData();

  if (loading || !timerInfo || !workingHours) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-gray-500">No active timer</p>
      </div>
    );
  }

  return <TimerCard timerInfo={timerInfo} workingHours={workingHours} />;
}

export default function ProfileSidebar({
  user,
  onUpdatePicture,
  onChangePassword,
}: ProfileSidebarProps) {
  const { lastLoginText, accountType, accountStatus } = useUserSession(user);

 

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600';
      case 'on leave':
      case 'onleave':
        return 'text-yellow-600';
      case 'inactive':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'admin':
        return 'text-purple-600';
      case 'supervisor':
        return 'text-indigo-600';
      case 'employee':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
          Quick Actions
        </h3>
        <div className="space-y-2 sm:space-y-3">
         
          <button 
            onClick={onUpdatePicture}
            className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base"
          >
            Update Profile Picture
          </button>
          <button 
            onClick={onChangePassword}
            className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
          Account Status
        </h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-600">Account Type</span>
            <span className={`text-xs sm:text-sm font-medium ${getAccountTypeColor(accountType)}`}>
              {accountType}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-600">Status</span>
            <span className={`text-xs sm:text-sm font-medium ${getStatusColor(accountStatus)}`}>
              {accountStatus}
            </span>
          
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-600">Last Login</span>
            <span className="text-xs sm:text-sm text-gray-900">{lastLoginText}</span>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Timer Details</h4>
            <TimerDetailsSection />
          </div>
        </div>
      </div>
    </div>
  );
}