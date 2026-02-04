"use client";

import { FormTextareaProps } from "../types";

export default function FormTextarea({
  label,
  name,
  value,
  placeholder,
  rows = 5,
  onChange
}: FormTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}