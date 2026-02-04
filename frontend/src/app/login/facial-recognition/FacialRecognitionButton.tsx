"use client";

import { Camera } from "lucide-react";
import { FacialRecognitionButtonProps } from "../types";

export default function FacialRecognitionButton({ onClick, loading = false }: FacialRecognitionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full bg-gray-100 text-gray-700 py-2.5 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
      <span>{loading ? "Loading..." : "Use Facial Recognition"}</span>
    </button>
  );
}
