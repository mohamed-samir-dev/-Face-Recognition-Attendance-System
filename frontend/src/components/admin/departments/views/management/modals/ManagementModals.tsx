'use client';

import { EditDepartmentModal, DeleteConfirmModal, SuccessMessage } from '../../../features/management';
import {ManagementModalsProps}from "../../../types"

export default function ManagementModals({
  editingDept,
  setEditingDept,
  users,
  onSave,
  deleteConfirm,
  setDeleteConfirm,
  onDeleteConfirm,
  showSuccessMessage,
  successMessage
}: ManagementModalsProps) {
  return (
    <>
      {editingDept && (
        <EditDepartmentModal
          editingDept={editingDept}
          setEditingDept={setEditingDept}
          users={users}
          onSave={onSave}
          onCancel={() => setEditingDept(null)}
        />
      )}

      {deleteConfirm.show && deleteConfirm.dept && (
        <DeleteConfirmModal
          department={deleteConfirm.dept}
          onConfirm={onDeleteConfirm}
          onCancel={() => setDeleteConfirm({ show: false, dept: null })}
        />
      )}

      {showSuccessMessage && (
        <SuccessMessage message={successMessage} />
      )}
    </>
  );
}