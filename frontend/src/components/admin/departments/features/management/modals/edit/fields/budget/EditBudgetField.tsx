'use client';


import {EditBudgetFieldProps}from "../../../../../../types"
export default function EditBudgetField({ value, onChange }: EditBudgetFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Budget ($)
      </label>
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || undefined)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
    </div>
  );
}