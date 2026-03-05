"use client";

import {
  EditFormFields as EditFields,
  PhotoUploadSection
} from '../../../../components';
import { EditFormFieldsProps } from '../../../../types';
import { useState } from 'react';

export default function EditFormFields({
  formData,
  setFormData,
  updating,
  hasNewPhoto,
  photoMessage,
  handlePhotoUpload,
  onResetClick
}: EditFormFieldsProps) {
  const [imageOption, setImageOption] = useState<'upload' | 'camera' | 'url'>('upload');

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
        imageOption={imageOption}
        setImageOption={setImageOption}
        photoError=""
        onFileUpload={handlePhotoUpload}
      />
    </> 
  );
}