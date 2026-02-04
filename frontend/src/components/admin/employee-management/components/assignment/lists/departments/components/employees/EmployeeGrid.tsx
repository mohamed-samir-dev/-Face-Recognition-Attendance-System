'use client';

import { Users } from 'lucide-react';
import { EmployeeGridProps } from '../../../../../../types';
import { EmployeeCard } from '../';



export default function EmployeeGrid({ users, onRemoveUser }: EmployeeGridProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No employees assigned to this department</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {users.map(user => (
        <EmployeeCard key={user.id} user={user} onRemove={onRemoveUser} />
      ))}
    </div>
  );
}