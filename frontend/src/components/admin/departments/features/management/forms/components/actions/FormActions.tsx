'use client';
import {FormActionsProps}from "../../../../../types"


export default function FormActions({ onCancel, onSubmit, submitText = "Add Department" }: FormActionsProps) {
  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        {submitText}
      </button>
    </div>
  );
}