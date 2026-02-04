'use client';

import { Users } from 'lucide-react';
import { User } from '@/lib/types';

interface UnassignedUsersProps {
  users: User[];
}

export default function UnassignedUsers({ users }: UnassignedUsersProps) {
  if (users.length === 0) return null;

  return (
    <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
      <h4 className="font-medium text-orange-900 mb-3 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Unassigned Users ({users.length})
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {users.map(user => (
          <div key={user.id} className="bg-white p-3 rounded border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">@{user.username}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}