'use client';

import { ArrowRight } from 'lucide-react';
import {AssignButtonProps}from"../../../../types"

export default function AssignButton({ selectedUser, selectedDepartment, onAssign }: AssignButtonProps) {
  return (
    <button
      onClick={onAssign}
      disabled={!selectedUser || !selectedDepartment}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
    >
      <ArrowRight className="w-4 h-4" />
      Assign
    </button>
  );
}