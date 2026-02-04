
import {Department}from "@/components/admin/departments/types"
// Settings Types


export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'public' | 'company' | 'optional';
  description?: string;
}



export interface AttendanceRule {
  id: string;
  name: string;
  type: 'late_arrival' | 'early_departure' | 'overtime';
  threshold: number;
  action: 'warning' | 'deduction' | 'approval_required';
  isActive: boolean;
}

export interface AttendanceRulesSectionProps {
  gracePeriod: number;
  onUpdate: (gracePeriod: number) => void;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  endDate?: string;
}
export interface HolidayListProps {
  holidays: Holiday[];
  onEditHoliday: (holiday: Holiday) => void;
  onHolidayDeleted: () => void;
}
export interface WorkingHours {
  startTime: string;
  endTime: string;
}


export interface WorkingHoursSectionProps {
  workingHours: WorkingHours;
  onUpdate: (hours: WorkingHours) => void;
}

export interface EditHolidayModalProps {
  holiday: Holiday;
  isOpen: boolean;
  onClose: () => void;
  onHolidayUpdated: () => void;
}
export interface AttendanceRules {
  gracePeriod: number;
  vacationDays?: number;
}

export interface CompanySettings {
  workingHours: WorkingHours;
  holidays: Holiday[];
  departments: Department[];
  attendanceRules: AttendanceRules;
}