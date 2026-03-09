import React from "react";
import { PersonalInfoFormProps } from "../types/index";
import { PersonalInfoGrid, PasswordField } from "./personal-info";

export default function PersonalInfoForm({
  formData,
  userPassword,
  userNumericId,
  onInputChange,
  onPasswordModalOpen,
}: PersonalInfoFormProps) {
  return (
    <div>
      <h2 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
        Personal Information
      </h2>
      
      <PersonalInfoGrid
        formData={formData}
        userNumericId={userNumericId}
        onInputChange={onInputChange}
      />
      
      <PasswordField
        userPassword={userPassword}
        onPasswordModalOpen={onPasswordModalOpen}
      />
    </div>
  );
}