"use client";

import { Department } from "../../types";
import { useUsers } from "../data/useUsers";
import { useDepartmentForm } from "../forms/useDepartmentForm";
import { useDepartmentActions } from "./useDepartmentActions";
import { useDepartmentEmployeeCount } from "../data/useDepartmentEmployeeCount";

export function useDepartmentManagement(
  departments: Department[],
  onDepartmentsChange: () => void
) {
  const { users } = useUsers();
  const {
    showAddForm,
    setShowAddForm,
    editingDept,
    setEditingDept,
    newDepartment,
    setNewDepartment,
    resetForm,
  } = useDepartmentForm();
  const {
    showSuccessMessage,
    successMessage,
    deleteConfirm,
    setDeleteConfirm,
    handleAddDepartment: addDepartment,
    handleUpdateDepartment: updateDepartment,
    handleDeleteClick,
    handleDeleteConfirm,
  } = useDepartmentActions(onDepartmentsChange);

  useDepartmentEmployeeCount(departments);

  const handleAddDepartment = () => {
    addDepartment(newDepartment, resetForm, setShowAddForm);
  };

  const handleUpdateDepartment = () => {
    updateDepartment(editingDept!, setEditingDept);
  };

  return {
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
  };
}
