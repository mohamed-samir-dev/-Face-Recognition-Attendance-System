"use client";

import {
  BasicInfoFields,
  PhotoUploadSection
} from '../../../../components';
import { FormFieldsProps } from '../../../../types';

export default function FormFields({
  formData,
  setFormData,
  photoError,
  generatedUsername,
  onNameChange
}: FormFieldsProps) {
  return (
    <>
      <BasicInfoFields 
        formData={formData}
        setFormData={setFormData}
        generatedUsername={generatedUsername}
        onNameChange={onNameChange}
      />

      <PhotoUploadSection
        formData={formData}
        setFormData={setFormData}
        photoError={photoError}
      />
    </>
  );
}