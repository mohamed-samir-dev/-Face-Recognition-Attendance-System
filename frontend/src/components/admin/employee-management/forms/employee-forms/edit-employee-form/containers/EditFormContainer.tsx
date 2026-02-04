"use client";

import EditFormFields from '../components/EditFormFields';
import EditFormActions from '../components/EditFormActions';
import { EditFormContainerProps } from '../../../../types';



export default function EditFormContainer({
  formData,
  setFormData,
  loading,
  updating,
  hasNewPhoto,
  photoMessage,
  handlePhotoUpload,
  onResetClick,
  handleSubmit
}: EditFormContainerProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 space-y-4 lg:space-y-6"
    >
      <EditFormFields
        formData={formData}
        setFormData={setFormData}
        updating={updating}
        hasNewPhoto={hasNewPhoto}
        photoMessage={photoMessage}
        handlePhotoUpload={handlePhotoUpload}
        onResetClick={onResetClick}
      />
      <EditFormActions loading={loading} />
    </form>
  );
}