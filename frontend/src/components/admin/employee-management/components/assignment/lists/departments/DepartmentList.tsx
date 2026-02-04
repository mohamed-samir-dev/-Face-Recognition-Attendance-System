'use client';

import {DepartmentListProps } from '../../../../types';
import { DepartmentCard, EmptyState } from './components';



export default function DepartmentList({ departments, users, searchQuery, onRemoveUser }: DepartmentListProps) {
  const getUsersByDepartment = (deptName: string) => {
    return users.filter(user => user.department === deptName || user.Department === deptName);
  };

  if (departments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {departments.map(dept => {
        const deptUsers = getUsersByDepartment(dept.name).filter(user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (searchQuery && deptUsers.length === 0) return null;

        return (
          <DepartmentCard
            key={dept.id}
            department={dept}
            users={deptUsers}
            onRemoveUser={onRemoveUser}
          />
        );
      })}
    </div>
  );
}