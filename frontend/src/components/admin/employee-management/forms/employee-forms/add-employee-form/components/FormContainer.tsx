"use client";

import FormFields from './FormFields';
import FormActions from './FormActions';
import {FormContainerProps}from "../../../../types"

export default function FormContainer({
  formData,
  setFormData,
  imageOption,
  setImageOption,
  photoError,
  loading,
  handleFileUpload,
  handleSubmit,
  generatedUsername,
  onNameChange
}: FormContainerProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 space-y-4 lg:space-y-6"
    >
      <FormFields
        formData={formData}
        setFormData={setFormData}
        imageOption={imageOption}
        setImageOption={setImageOption}
        photoError={photoError}
        handleFileUpload={handleFileUpload}
        generatedUsername={generatedUsername}
        onNameChange={onNameChange}
      />
      <FormActions loading={loading} />
    </form>
  );
}