'use client';

import FormField from '../../ui/FormField';
import {DepartmentLocationFieldProps}from "../../../../../../types"


export default function DepartmentLocationField({ value, onChange }: DepartmentLocationFieldProps) {
  return (
    <FormField label="Location">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        placeholder="e.g., Building A, Floor 3"
      />
    </FormField>
  );
}