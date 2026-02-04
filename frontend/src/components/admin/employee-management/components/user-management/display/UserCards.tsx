'use client';

import { UserCardsProps } from '../../../types';
import { EmptyState, UserCard } from './user-cards';


export default function UserCards({ users, deleting, onEdit, onDelete, onChangePassword, getStatusColor, getStatusText, hideDelete }: UserCardsProps) {
  if (users.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="lg:hidden space-y-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          deleting={deleting}
          onEdit={onEdit}
          onDelete={onDelete}
          onChangePassword={onChangePassword}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          hideDelete={hideDelete}
        />
      ))}
    </div>
  );
}