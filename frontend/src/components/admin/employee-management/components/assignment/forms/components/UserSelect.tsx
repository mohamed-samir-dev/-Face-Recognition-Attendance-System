'use client';

import {UserSelectProps} from "../../../../types"

export default function UserSelect({ users, selectedUser, onUserSelect }: UserSelectProps) {
  const unassignedUsers = users.filter(user => !user.department && !user.Department);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
      <select
        value={selectedUser?.id || ''}
        onChange={(e) => {
          const user = users.find(u => u.id === e.target.value);
          onUserSelect(user || null);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      >
        <option value="">Choose a user</option>
        {unassignedUsers.map(user => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.username})
          </option>
        ))}
      </select>
    </div>
  );
}