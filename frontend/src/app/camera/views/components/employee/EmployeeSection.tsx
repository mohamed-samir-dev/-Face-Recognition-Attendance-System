"use client";

import EmployeeInfoDisplay from "../../../components/EmployeeInfoDisplay";
import {EmployeeSectionProps}from "../../../types"


export default function EmployeeSection({ attendanceMarked, recognizedEmployee }: EmployeeSectionProps) {
  if (!attendanceMarked || !recognizedEmployee) return null;
  if (recognizedEmployee.id === "unknown" || recognizedEmployee.id === "unauthorized") return null;

  const employeeData = {
    ...recognizedEmployee,
    email: recognizedEmployee.email || '',
    department: recognizedEmployee.department || recognizedEmployee.Department || '',
    position: recognizedEmployee.jobTitle || ''
  };

  return (
    <div className="mt-4">
      <EmployeeInfoDisplay key={recognizedEmployee.id} employee={employeeData} />
    </div>
  );
}