import { AttendanceStats, DepartmentStats } from "@/components/admin";
import { ReactNode } from "react";

export interface DashboardContentProps {
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  currentStats: AttendanceStats | DepartmentStats | null;
}

export interface DashboardLayoutProps {
  children: ReactNode;
}

export interface DepartmentButtonProps {
  department: string;
  isSelected: boolean;
  onClick: () => void;
}

export interface DepartmentListProps {
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
}
export interface DepartmentSelectorProps {
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
}
export interface MetricsGridProps {
  stats: AttendanceStats | DepartmentStats | null;
}


export interface AttendanceSummaryProps {
  stats: AttendanceStats | DepartmentStats | null;
}