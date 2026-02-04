import React from "react";
import InputField from "./InputField";
import {PersonalInfoGridProps}from "../../types"

export default function PersonalInfoGrid({ formData, userNumericId, onInputChange }: PersonalInfoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <InputField
        label="Full Name"
        value={formData.fullName}
        onChange={(value) => onInputChange("fullName", value)}
      />
      
      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => onInputChange("email", value)}
      />
      
      <InputField
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={(value) => onInputChange("phone", value)}
        placeholder="Enter phone number"
      />
      
      <InputField
        label="Job Title"
        value={formData.jobTitle}
        readOnly
      />
      
      <InputField
        label="Department"
        value={formData.department}
        readOnly
      />
      
      <InputField
        label="Employee ID"
        value={userNumericId || ""}
        readOnly
      />
    </div>
  );
}