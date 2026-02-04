import { User } from "@/lib/types";
import { LucideIcon } from "lucide-react";

export interface LeaveRequestFormProps {
  user: User;
  formData: {
    startDate: string;
    endDate: string;
    leaveType: string;
    reason: string;
    contactName: string;
    phoneNumber: string;
  };
  isSubmitting: boolean;
  disabled?: boolean;
  dateError?: string;
  leaveWarning?: string;
  leaveDaysTaken?: number;
  allowedLeaveDays?: number;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onCancel: () => void;
}
export interface EmergencyContactSectionProps {
  formData: {
    contactName: string;
    phoneNumber: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface EmployeeInfoSectionProps {
  user: User;
}
export interface FormActionsProps {
  isSubmitting: boolean;
  disabled?: boolean;
  onCancel: () => void;
}
export interface LeaveDetailsSectionProps {
  formData: {
    startDate: string;
    endDate: string;
    leaveType: string;
    reason: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  dateError?: string;
  leaveWarning?: string;
  leaveDaysTaken?: number;
  allowedLeaveDays?: number;
}
export interface LeaveRequestLayoutProps {
  user: User;
  toast: {
    message: string;
    type: "success" | "error" | "warning";
    isVisible: boolean;
  };
  onCloseToast: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export interface FormInputProps {
  label: string;
  name?: string;
  type?: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  icon: LucideIcon;
  min?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

