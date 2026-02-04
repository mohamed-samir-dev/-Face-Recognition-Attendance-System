'use client';

import { DepartmentSelectProps } from '../../../../types';


export default function DepartmentSelect({ departments, selectedDepartment, onDepartmentSelect }: DepartmentSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Department</label>
      <select
        value={selectedDepartment}
        onChange={(e) => onDepartmentSelect(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      >
        <option value="">Choose a department</option>
        {departments.map(dept => (
          <option key={dept.id} value={dept.name}>
            {dept.name}
          </option>
        ))}
      </select>
    </div>
  );
}