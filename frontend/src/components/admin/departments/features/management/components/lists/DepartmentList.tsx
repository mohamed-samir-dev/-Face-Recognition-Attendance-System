'use client';

import DepartmentCard from '../cards/DepartmentCard';
import EmptyDepartmentState from '../states/EmptyDepartmentState';
import {DepartmentListProps}from "../../../../types"


export default function DepartmentList({ departments, onEdit, onDelete }: DepartmentListProps) {
  if (departments.length === 0) {
    return <EmptyDepartmentState />;
  }

  return (
    <div className="space-y-4">
      {departments.map((dept) => (
        <DepartmentCard
          key={dept.id}
          department={dept}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}