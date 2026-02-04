"use client";

import {FormInputProps}from "../types"


export default function FormInput({
  label,
  name,
  type = "text",
  value,
  placeholder,
  required = false,
  readOnly = false,
  icon: Icon,
  min,
  onChange
}: FormInputProps) {
  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-blue-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`flex items-center border border-gray-300 rounded-lg px-4 py-3 transition-all duration-200 ${readOnly ? 'bg-gray-50' : 'bg-white hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 focus-within:shadow-sm'}`}>
        <Icon className={`mr-3 transition-colors duration-200 ${readOnly ? 'text-gray-400' : 'text-gray-500 group-focus-within:text-blue-500'}`} size={20} />
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`w-full outline-none bg-transparent transition-colors duration-200 ${readOnly ? 'text-gray-600' : 'text-gray-800 placeholder-gray-400'} ${type === 'date' ? 'cursor-pointer' : ''}`}
          required={required}
          readOnly={readOnly}
          min={min}
        />
      </div>
    </div>
  );
}