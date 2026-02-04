'use client';

import UserHeader from '../header/UserHeader';
import UserDetails from '../details/UserDetails';
import UserActions from '../actions/UserActions';
import {UserCardProps}from "../../../../../types"

export default function UserCard({ user, deleting, onEdit, onDelete, onChangePassword, getStatusColor, getStatusText, hideDelete }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <UserHeader 
        user={user}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />
      <UserDetails user={user} />
      <UserActions 
        user={user}
        deleting={deleting}
        onEdit={onEdit}
        onDelete={onDelete}
        onChangePassword={onChangePassword}
        hideDelete={hideDelete}
      />
    </div>
  );
}