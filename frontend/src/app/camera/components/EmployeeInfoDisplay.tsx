"use client";
import { EmployeeInfoDisplayProps } from "../types";
import { useEmployeeNotification } from "../hooks/useEmployeeNotification";
import AttendanceTakenModal from "./employee/AttendanceTakenModal";

export default function EmployeeInfoDisplay({ employee }: EmployeeInfoDisplayProps) {
  useEmployeeNotification(employee);

  if (employee.id === "attendance_taken") {
    return <AttendanceTakenModal />;
  }

  return null;
}