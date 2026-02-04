'use client';

import { EmployeeCardProps } from '../../../../../../types';



export default function EmployeeCard({ user, onRemove }: EmployeeCardProps) {
  return (
    <div className="bg-gray-50 p-3 rounded border">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-600">@{user.username}</p>
          {user.jobTitle && (
            <p className="text-xs text-gray-500">{user.jobTitle}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(user.id)}
          className="text-red-600 hover:bg-red-100 p-1 rounded transition-colors"
          title="Remove from department"
        >
          ×
        </button>
      </div>
    </div>
  );
}