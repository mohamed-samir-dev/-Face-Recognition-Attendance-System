import { ReactNode } from "react";
import { LeaveRequest } from "@/components/admin";

// Common Component Types

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}




export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest | null;
  onStatusUpdate: (id: string, status: 'Approved' | 'Rejected') => void;
}


export interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}


export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
}
export interface NotificationBellProps {
  employeeId: string;
}

export interface CircularProgressProps {
  percentage: number;
  total: number;
  present: number;
}
