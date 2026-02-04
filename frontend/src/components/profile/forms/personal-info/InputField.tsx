import React from "react";
import { InputFieldProps } from "../../types";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  readOnly = false,
  placeholder
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm sm:text-base ${
          readOnly ? "bg-gray-50" : ""
        }`}
      />
    </div>
  );
}