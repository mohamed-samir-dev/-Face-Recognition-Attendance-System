"use client";

import {
  ResetPhotoModal,
  EditEmployeeSuccessModal
} from '../../../../modals';
import {EditFormModalsProps}from "../../../../types"


export default function EditFormModals({
  showSuccess,
  showResetModal,
  setShowResetModal,
  handleResetPhoto
}: EditFormModalsProps) {
  return (
    <>
      <EditEmployeeSuccessModal show={showSuccess} />
      <ResetPhotoModal
        show={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetPhoto}
      />
    </>
  );
}