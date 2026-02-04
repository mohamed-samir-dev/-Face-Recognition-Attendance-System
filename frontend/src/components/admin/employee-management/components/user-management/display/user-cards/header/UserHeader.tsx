'use client';

import { UserHeaderProps } from '../../../../../types';
import UserAvatar from '../avatar/UserAvatar';
import StatusBadge from '../status/StatusBadge';



export default function UserHeader({ user, getStatusColor, getStatusText }: UserHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        <UserAvatar image={user.image} name={user.name} />
        <div>
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.jobTitle || "Employee"}</p>
        </div>
      </div>
      <StatusBadge 
        status={user.status}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />
    </div>
  );
}