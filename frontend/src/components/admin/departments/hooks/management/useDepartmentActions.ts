"use client";

import { useState } from "react";
import { Department, NewDepartment } from "../../types";
import {
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/lib/services/system/settingsService";
import { updateUser } from "@/lib/services/user/userService";

export function useDepartmentActions(onDepartmentsChange: () => void) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    dept: Department | null;
  }>({ show: false, dept: null });

  const handleAddDepartment = async (
    newDepartment: NewDepartment,
    resetForm: () => void,
    setShowAddForm: (show: boolean) => void
  ) => {
    if (!newDepartment.name || !newDepartment.head) return;

    try {
      await addDepartment({
        name: newDepartment.name,
        head: newDepartment.head,
        headId: newDepartment.headId,
        description: newDepartment.description,
        budget: newDepartment.budget
          ? parseFloat(newDepartment.budget)
          : undefined,
        location: newDepartment.location,
      });

      // Update user to Supervisor if they are Employee
      if (newDepartment.headId) {
        try {
          await updateUser(newDepartment.headId, { accountType: 'Supervisor' });
        } catch (error) {
          console.error('Error updating user to supervisor:', error);
        }
      }

      resetForm();
      setShowAddForm(false);
      onDepartmentsChange();
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const handleUpdateDepartment = async (
    editingDept: Department,
    setEditingDept: (dept: Department | null) => void
  ) => {
    if (!editingDept) return;

    try {
      await updateDepartment(editingDept.id, editingDept);
      
      // Update user to Supervisor if they are Employee
      if (editingDept.headId) {
        try {
          await updateUser(editingDept.headId, { accountType: 'Supervisor' });
        } catch (error) {
          console.error('Error updating user to supervisor:', error);
        }
      }
      
      setEditingDept(null);
      onDepartmentsChange();
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const handleDeleteClick = (dept: Department) => {
    setDeleteConfirm({ show: true, dept });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.dept) return;

    try {
      await deleteDepartment(deleteConfirm.dept.id);
      setSuccessMessage(
        `Department "${deleteConfirm.dept.name}" has been successfully deleted.`
      );
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setDeleteConfirm({ show: false, dept: null });
      onDepartmentsChange();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  return {
    showSuccessMessage,
    successMessage,
    deleteConfirm,
    setDeleteConfirm,
    handleAddDepartment,
    handleUpdateDepartment,
    handleDeleteClick,
    handleDeleteConfirm,
  };
}
