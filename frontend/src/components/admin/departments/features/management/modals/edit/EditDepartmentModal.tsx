'use client';

import { EditDepartmentModalProps } from '../../../../types';
import ModalOverlay from '../shared/ModalOverlay';
import EditDepartmentFields from './EditDepartmentFields';
import ModalActions from '../shared/ModalActions';



export default function EditDepartmentModal({
  editingDept,
  setEditingDept,
  users,
  onSave,
  onCancel
}: EditDepartmentModalProps) {
  return (
    <ModalOverlay>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Edit Department
        </h3>
        <EditDepartmentFields
          editingDept={editingDept}
          setEditingDept={setEditingDept}
          users={users}
        />
        <ModalActions
          onCancel={onCancel}
          onSave={onSave}
        />
      </div>
    </ModalOverlay>
  );
}