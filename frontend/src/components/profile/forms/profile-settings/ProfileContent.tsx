import React from "react";
import { ProfilePicture } from "../../ui";
import { PersonalInfoForm, NotificationSettings } from "../";
import PrivacySettings from "./PrivacySettings";
import {ProfileContentProps}from "../../types"

export default function ProfileContent({
  profilePictureRef,
  selectedImage,
  user,
  formData,
  handleImageChange,
  handleInputChange,
  setShowPasswordModal
}: ProfileContentProps) {
  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div>
        <ProfilePicture
          ref={profilePictureRef}
          selectedImage={selectedImage}
          userImage={user.image}
          userName={user.name}
          onImageChange={handleImageChange}
        />

        <PersonalInfoForm
          formData={formData}
          userPassword={user.password || ""}
          userNumericId={user.numericId?.toString() || ""}
          onInputChange={handleInputChange}
          onPasswordModalOpen={() => setShowPasswordModal(true)}
        />
      </div>

      <NotificationSettings
        formData={formData}
        onInputChange={handleInputChange}
      />

      <PrivacySettings
        attendanceHistoryVisibility={formData.attendanceHistoryVisibility}
        onInputChange={handleInputChange}
      />
    </div>
  );
}