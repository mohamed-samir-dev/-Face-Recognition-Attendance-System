"use client";

import { User, Phone } from "lucide-react";
import FormInput from "../../ui/FormInput";
import {EmergencyContactSectionProps}from "../../types"


export default function EmergencyContactSection({ formData, onChange }: EmergencyContactSectionProps) {
  return (
    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Emergency Contact Information
        </h3>
        <span className="text-xs sm:text-sm text-gray-500 bg-gray-200 px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto">
          Optional
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <FormInput
          label="Contact Name"
          name="contactName"
          value={formData.contactName}
          placeholder="Full name of emergency contact"
          icon={User}
          onChange={onChange}
        />
        <FormInput
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          placeholder="Contact phone number"
          icon={Phone}
          onChange={onChange}
        />
      </div>
    </div>
  );
}