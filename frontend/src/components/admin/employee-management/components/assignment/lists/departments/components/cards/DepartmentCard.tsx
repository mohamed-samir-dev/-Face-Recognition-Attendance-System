'use client';

import { Building } from 'lucide-react';
import {  DepartmentCardProps } from '../../../../../../types';
import { EmployeeGrid } from '../';



export default function DepartmentCard({ department, users, onRemoveUser }: DepartmentCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="font-medium text-gray-900">{department.name}</h4>
            {department.description && (
              <p className="text-sm text-gray-600">{department.description}</p>
            )}
          </div>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          {users.length} employees
        </span>
      </div>
      <EmployeeGrid users={users} onRemoveUser={onRemoveUser} />
    </div>
  );
}