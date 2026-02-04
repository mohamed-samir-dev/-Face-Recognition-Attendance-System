'use client';
import {FormFieldProps}from "../../../../../types"


export default function FormField({ label, required = false, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      {children}
    </div>
  );
}