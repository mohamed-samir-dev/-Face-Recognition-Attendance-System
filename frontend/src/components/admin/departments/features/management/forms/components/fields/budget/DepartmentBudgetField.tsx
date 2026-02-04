'use client';

import FormField from '../../ui/FormField';
import {DepartmentBudgetFieldProps}from "../../../../../../types"


export default function DepartmentBudgetField({ value, onChange }: DepartmentBudgetFieldProps) {
  return (
    <FormField label="Budget ($)">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        placeholder="e.g., 100000"
      />
    </FormField>
  );
}