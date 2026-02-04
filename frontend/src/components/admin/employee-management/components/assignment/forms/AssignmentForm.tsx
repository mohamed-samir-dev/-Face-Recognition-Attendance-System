'use client';

import { AssignmentFormProps } from '../../../types';
import { UserSelect, DepartmentSelect, AssignButton } from './components';



export default function AssignmentForm({
  users,
  departments,
  selectedUser,
  selectedDepartment,
  onUserSelect,
  onDepartmentSelect,
  onAssign
}: AssignmentFormProps) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
      <h4 className="font-medium text-gray-900 mb-4">Assign User to Department</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <UserSelect 
          users={users}
          selectedUser={selectedUser}
          onUserSelect={onUserSelect}
        />
        <DepartmentSelect 
          departments={departments}
          selectedDepartment={selectedDepartment}
          onDepartmentSelect={onDepartmentSelect}
        />
        <AssignButton 
          selectedUser={selectedUser}
          selectedDepartment={selectedDepartment}
          onAssign={onAssign}
        />
      </div>
    </div>
  );
}