import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { LeaveRequest } from "@/components/admin";

export const getStatusIcon = (status: LeaveRequest['status']): React.ReactElement => {
  const icons: Record<LeaveRequest['status'], React.ReactElement> = {
    Approved: React.createElement(CheckCircle, { className: "w-4 h-4 text-green-600" }),
    Rejected: React.createElement(XCircle, { className: "w-4 h-4 text-red-600" }),
    Pending: React.createElement(AlertCircle, { className: "w-4 h-4 text-amber-600" })
  };
  return icons[status] || icons.Pending;
};

export const getStatusColor = (status: LeaveRequest['status']) => {
  const colors = {
    Approved: 'text-green-600 bg-green-50',
    Rejected: 'text-red-600 bg-red-50',
    Pending: 'text-amber-600 bg-amber-50'
  };
  return colors[status] || colors.Pending;
};