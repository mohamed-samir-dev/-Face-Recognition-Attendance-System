"use client";
import {FormActionsProps}from "../../types"


export default function FormActions({ isSubmitting, disabled = false, onCancel }: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm sm:text-base"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || disabled}
        className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Leave Request"}
      </button>
    </div>
  );
}