'use client';
import {ManagementContentProps}from "../../../types"
import { AddDepartmentForm, DepartmentList } from '../../../features/management';



export default function ManagementContent({
  departments,
  showAddForm,
  newDepartment,
  setNewDepartment,
  users,
  onAdd,
  onCancelAdd,
  onEdit,
  onDelete
}: ManagementContentProps) {
  return (
    <>
      {showAddForm && (
        <AddDepartmentForm
          newDepartment={newDepartment}
          setNewDepartment={setNewDepartment}
          users={users}
          onAdd={onAdd}
          onCancel={onCancelAdd}
        />
      )}

      <DepartmentList
        departments={departments}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}