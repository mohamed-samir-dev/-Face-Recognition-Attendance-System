'use client';

import { Plus, Building } from 'lucide-react';

interface ManagementHeaderProps {
  onAddClick: () => void;
}

export default function ManagementHeader({ onAddClick }: ManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          Department Management
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage organizational departments and structure
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Department
      </button>
    </div>
  );
}