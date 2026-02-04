'use client';

import { RotateCcw } from 'lucide-react';
import {ResetButtonProps}from "../../../../../types"


export default function ResetButton({ hasNewPhoto, onResetClick }: ResetButtonProps) {
  if (!hasNewPhoto) return null;

  return (
    <button
      type="button"
      onClick={onResetClick}
      className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
    >
      <RotateCcw className="w-4 h-4" />
      <span className="hidden sm:inline">Reset Facial Data</span>
      <span className="sm:hidden">Reset</span>
    </button>
  );
}