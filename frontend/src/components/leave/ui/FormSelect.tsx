"use client";

import { ChevronDown } from "lucide-react";
import {FormSelectProps}from"../types"

export default function FormSelect({
  label,
  name,
  value,
  options,
  required = false,
  onChange
}: FormSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 appearance-none outline-none text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-4 top-4 text-gray-400 pointer-events-none"
          size={20}
        />
      </div>
    </div>
  );
}