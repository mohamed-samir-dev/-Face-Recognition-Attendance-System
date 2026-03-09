'use client';

import { UserHeaderProps } from '../../../../../types';
import UserAvatar from '../avatar/UserAvatar';
import StatusBadge from '../status/StatusBadge';



export default function UserHeader({ user, getStatusColor, getStatusText }: UserHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3 gap-2">
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
        <UserAvatar image={user.image} name={user.name} />
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{user.name}</h3>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{user.jobTitle || "Employee"}</p>
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