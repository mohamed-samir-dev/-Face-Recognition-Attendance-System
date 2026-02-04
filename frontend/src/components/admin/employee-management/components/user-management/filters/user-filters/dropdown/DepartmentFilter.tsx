'use client';

import { Filter } from 'lucide-react';
import { DepartmentFilterProps } from '../../../../../types'

export default function DepartmentFilter({ departmentFilter, setDepartmentFilter, departments }: DepartmentFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
      <select
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
        className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Departments</option>
        <option value="Unassigned">Unassigned</option>
        {departments.map(dept => (
          <option key={dept.id} value={dept.name}>{dept.name}</option>
        ))}
      </select>
    </div>
  );
}