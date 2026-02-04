import { DocumentData } from "firebase/firestore";
import { User } from "@/lib/types";

export interface AttendanceChartProps {
    title: string;
    percentage: number;
    improvement: number;
    type: "line" | "bar";
  }
  export interface ProfileSectionProps {
    user: DocumentData;
    onRequestLeave?: () => void;
    onTakePhoto: () => void;
    onCheckOut?: () => void;
  }
  

export interface DashboardContentProps {
  user: User;
  onTakeAttendance: () => void;
  onRequestLeave: () => void;
  onCheckOut?: () => void;
}
export interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  onDashboard: () => void;
  onReports: () => void;
  onSettings: () => void;
  children: React.ReactNode;
}


export interface SummaryCardProps {
  title: string;
  value?: string | number;
  color?: "blue" | "yellow" | "red" | "green";
  icon?: React.ReactNode;
  timer?: string;
  overtimeTimer?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  startDate: string;
  endDate: string;
}

export interface AbsenceRequestsData {
  userRequests: LeaveRequest[];
  pendingRequests: LeaveRequest[];
  approvedRequests: LeaveRequest[];
  recentRequests: LeaveRequest[];
}

export interface AttendanceData {
  totalHours: number;
  lateArrivals: number;
  leaveDays: string;
  timeRemaining?: string;
  overtimeTimer?: string;
  overtimeHours: number;
  isActive: boolean;
  isOvertime: boolean;
}

export interface TimerInfo {
  checkInTime: string;
  elapsedHours: number;
  remainingMs: number;
  isActive: boolean;
  isOvertime: boolean;
  overtimeHours: number;
}

export interface ViewAllButtonProps {
  totalCount: number;
  showAll: boolean;
  onToggle: () => void;
}