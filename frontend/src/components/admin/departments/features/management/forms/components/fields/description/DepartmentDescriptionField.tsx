'use client';

import FormField from '../../ui/FormField';
import {DepartmentDescriptionFieldProps}from "../../../../../../types"


export default function DepartmentDescriptionField({ value, onChange }: DepartmentDescriptionFieldProps) {
  return (
    <FormField label="Description">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        rows={3}
        placeholder="Brief description of the department's role and responsibilities"
      />
    </FormField>
  );
}