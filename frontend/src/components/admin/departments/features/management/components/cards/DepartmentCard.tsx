'use client';

import DepartmentInfo from '../info/DepartmentInfo';
import DepartmentActions from '../actions/DepartmentActions';
import {ManagementDepartmentCardProps} from "../../../../types"

export default function DepartmentCard({ department, onEdit, onDelete }: ManagementDepartmentCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <DepartmentInfo department={department} />
        <DepartmentActions 
          department={department}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}