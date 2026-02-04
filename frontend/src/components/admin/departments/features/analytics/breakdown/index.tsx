"use client";

import { DepartmentBreakdownProps } from "../../../types";
import DepartmentCard from "./DepartmentCard";

export default function DepartmentBreakdown({
  stats,
  totalEmployees,
  largestDepartment,
  highestBudgetDept,
}: DepartmentBreakdownProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-base font-semibold text-gray-900">
        Department Breakdown
      </h4>

      <div className="space-y-3">
        {stats
          .sort((a, b) => b.employeeCount - a.employeeCount)
          .map((stat, index) => (
            <DepartmentCard
              key={stat.department.id}
              stat={stat}
              index={index}
              totalEmployees={totalEmployees}
              largestDepartment={largestDepartment}
              highestBudgetDept={highestBudgetDept}
            />
          ))}
      </div>
    </div>
  );
}
