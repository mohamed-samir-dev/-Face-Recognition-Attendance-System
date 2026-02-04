'use client';

import { EmptyTableState, TableHeader, TableRow } from './user-table';
import {UserTableProps}from "../../../types"


export default function UserTable({ users, deleting, onEdit, onDelete, onChangePassword, getStatusColor, getStatusText, hideDelete }: UserTableProps) {
  if (users.length === 0) {
    return <EmptyTableState />;
  }

  return (
    <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
        <TableHeader />
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <TableRow
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
        </tbody>
        </table>
      </div>
    </div>
  );
}