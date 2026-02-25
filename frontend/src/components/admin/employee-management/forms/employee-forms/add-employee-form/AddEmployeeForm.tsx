"use client";

import { AddEmployeeSuccessModal } from "../../../modals";
import EmailWarningModal from "../../../components/forms/fields/components/EmailWarningModal";
import { useAddEmployee } from "../../../hooks";
import { FormHeader, FormContainer } from ".";

export default function AddEmployeeForm() {
  const {
    loading,
    showSuccess,
    photoError,
    showEmailWarning,
    setShowEmailWarning,
    existingUser,
    generatedUsername,
    formData,
    setFormData,
    imageOption,
    setImageOption,
    handleFileUpload,
    handleSubmit,
    previewUsername,
  } = useAddEmployee();

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-2xl mx-auto">
        <FormHeader />
        <FormContainer
          formData={formData}
          setFormData={setFormData}
          imageOption={imageOption}
          setImageOption={setImageOption}
          photoError={photoError}
          loading={loading}
          handleFileUpload={handleFileUpload}
          handleSubmit={handleSubmit}
          generatedUsername={generatedUsername}
          onNameChange={previewUsername}
        />
      </div>
      <AddEmployeeSuccessModal show={showSuccess} />
      {existingUser && (
        <EmailWarningModal 
          show={showEmailWarning}
          existingUser={existingUser as { name: string; department: string; jobTitle: string; numericId: number; accountType: string; supervisor?: string }}
          onClose={() => setShowEmailWarning(false)}
        />
      )}
    </div>
  );
}
