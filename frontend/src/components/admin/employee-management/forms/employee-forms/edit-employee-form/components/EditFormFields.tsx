"use client";

import {
  EditFormFields as EditFields,
  PhotoUploadSection
} from '../../../../components';
import { EditFormFieldsProps } from '../../../../types';

export default function EditFormFields({
  formData,
  setFormData,
  updating,
  hasNewPhoto,
  photoMessage,
  handlePhotoUpload,
  onResetClick
}: EditFormFieldsProps) {
  return (
    <>
      <EditFields 
        formData={formData}
        setFormData={setFormData}
        updating={updating}
        hasNewPhoto={hasNewPhoto}
        photoMessage={photoMessage}
        handlePhotoUpload={handlePhotoUpload}
        onResetClick={onResetClick}
      />

      <PhotoUploadSection
        formData={formData}
        setFormData={setFormData}
        photoError=""
      />
    </> 
  );
}