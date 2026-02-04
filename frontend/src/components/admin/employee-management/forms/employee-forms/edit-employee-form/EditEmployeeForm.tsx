"use client";

import { LoadingState } from "../../../components";
import { useEditEmployee } from "../../../hooks";
import { EditFormHeader, EditFormContainer, EditFormModals } from ".";

export default function EditEmployeeForm() {
  const {
    formData,
    setFormData,
    loading,
    showSuccess,
    employee,
    updating,
    photoMessage,
    hasNewPhoto,
    showResetModal,
    setShowResetModal,
    handleResetPhoto,
    handlePhotoUpload,
    handleSubmit,
  } = useEditEmployee();

  if (!employee) {
    return <LoadingState />;
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-2xl mx-auto">
        <EditFormHeader />
        <EditFormContainer
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          updating={updating}
          hasNewPhoto={hasNewPhoto}
          photoMessage={photoMessage?.text || ""}
          handlePhotoUpload={handlePhotoUpload}
          onResetClick={() => setShowResetModal(true)}
          handleSubmit={handleSubmit}
        />
      </div>
      <EditFormModals
        showSuccess={showSuccess}
        showResetModal={showResetModal}
        setShowResetModal={setShowResetModal}
        handleResetPhoto={handleResetPhoto}
      />
    </div>
  );
}
