'use client';

// import { NewDepartment } from "@/lib/types/dapartment";
import FormField from '../../ui/FormField';

import {DepartmentNameFieldProps}from "../../../../../../types"


export default function DepartmentNameField({ value, onChange }: DepartmentNameFieldProps) {
  return (
    <FormField label="Department Name" required>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        placeholder="e.g., Engineering"
      />
    </FormField>
  );
}