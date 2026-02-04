'use client';
import { Edit, Trash2 } from 'lucide-react';
import {DepartmentActionsProps} from "../../../../types"
export default function DepartmentActions({ department, onEdit, onDelete }: DepartmentActionsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(department)}
        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
        title="Edit Department"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(department)}
        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
        title="Delete Department"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}