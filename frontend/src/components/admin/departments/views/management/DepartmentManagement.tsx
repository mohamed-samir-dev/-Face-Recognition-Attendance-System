"use client";

import { useDepartmentManagement } from '../../features/management';
import ManagementContainer from './container/ManagementContainer';
import ManagementHeader from './header/ManagementHeader';
import ManagementContent from './content/ManagementContent';
import ManagementModals from './modals/ManagementModals';
import {DepartmentManagementProps}from "../../types"


export default function DepartmentManagement({
  departments,
  onDepartmentsChange,
}: DepartmentManagementProps) {
  const {
    users,
    showAddForm,
    setShowAddForm,
    editingDept,
    setEditingDept,
    showSuccessMessage,
    successMessage,
    deleteConfirm,
    setDeleteConfirm,
    newDepartment,
    setNewDepartment,
    handleAddDepartment,
    handleUpdateDepartment,
    handleDeleteClick,
    handleDeleteConfirm,
  } = useDepartmentManagement(departments, onDepartmentsChange);

  return (
    <ManagementContainer>
      <ManagementHeader onAddClick={() => setShowAddForm(true)} />
      
      <ManagementContent
        departments={departments}
        showAddForm={showAddForm}
        newDepartment={newDepartment}
        setNewDepartment={setNewDepartment}
        users={users}
        onAdd={handleAddDepartment}
        onCancelAdd={() => setShowAddForm(false)}
        onEdit={setEditingDept}
        onDelete={handleDeleteClick}
      />

      <ManagementModals
        editingDept={editingDept}
        setEditingDept={setEditingDept}
        users={users}
        onSave={handleUpdateDepartment}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        onDeleteConfirm={handleDeleteConfirm}
        showSuccessMessage={showSuccessMessage}
        successMessage={successMessage}
      />
    </ManagementContainer>
  );
}
