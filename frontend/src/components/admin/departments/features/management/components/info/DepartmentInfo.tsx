'use client';

import { Users, MapPin, DollarSign } from 'lucide-react';
import {DepartmentInfoProps}from "../../../../types"

export default function DepartmentInfo({ department }: DepartmentInfoProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <h4 className="text-lg font-semibold text-gray-900">
          {department.name}
        </h4>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Head: {department.head}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Employees: {department.employeeCount || 0}</span>
        </div>
        {department.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{department.location}</span>
          </div>
        )}
        {department.budget && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>${department.budget.toLocaleString()}</span>
          </div>
        )}
      </div>

      {department.description && (
        <p className="text-sm text-gray-600 mt-2">
          {department.description}
        </p>
      )}
    </div>
  );
}