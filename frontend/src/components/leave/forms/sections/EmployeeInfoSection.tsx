"use client";

import { User } from "lucide-react";
import { EmployeeInfoSectionProps } from "../../types";
import FormInput from "../../ui/FormInput";

export default function EmployeeInfoSection({ user }: EmployeeInfoSectionProps) {
  return (
    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
        Employee Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <FormInput
          label="Employee ID"
          value={user.numericId?.toString() || ""}
          icon={User}
          readOnly
        />
        <FormInput
          label="Employee Name"
          value={user.name || ""}
          icon={User}
          readOnly
        />
      </div>
    </div>
  );
}