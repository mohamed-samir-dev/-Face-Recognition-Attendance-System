'use client';


import {EditLocationFieldProps}from "../../../../../../types"

export default function EditLocationField({ value, onChange }: EditLocationFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
    </div>
  );
}