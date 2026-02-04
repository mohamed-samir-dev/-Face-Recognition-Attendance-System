'use client';

import {EditDescriptionFieldProps}from "../../../../../../types"

export default function EditDescriptionField({ value, onChange }: EditDescriptionFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        rows={3}
      />
    </div>
  );
}