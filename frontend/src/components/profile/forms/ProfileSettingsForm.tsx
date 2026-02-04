"use client";

import { useRef } from "react";
import { useProfileForm } from "../hooks/useProfileForm";
import { usePasswordModal } from "../hooks/usePasswordModal";
import { ProfilePictureRef } from "../ui";
import { PasswordModal } from "../modals";
import { ProfileSidebar } from "../layout";
import { SuccessNotifications } from "../notifications";
import { User } from "@/lib/types";
import { ProfileHeader, ProfileContent, ActionButtons } from "./profile-settings";

interface ProfileSettingsFormProps {
  user: User;
}

export default function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const profilePictureRef = useRef<ProfilePictureRef | null>(null);
  
  const {
    formData,
    selectedImage,
    showSuccess,
    handleInputChange,
    handleImageChange,
    handleSave,
  } = useProfileForm(user);

  const {
    showPasswordModal,
    setShowPasswordModal,
    passwordData,
    showPasswordSuccess,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordError,
    handlePasswordChange,
    handlePasswordUpdate,
  } = usePasswordModal(user);

  const handleCancel = () => {
    console.log("Cancelling changes");
  };

  return (
    <>
      <SuccessNotifications 
        showSuccess={showSuccess} 
        showPasswordSuccess={showPasswordSuccess} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <ProfileHeader />
            
            <ProfileContent
              profilePictureRef={profilePictureRef}
              selectedImage={selectedImage}
              user={user}
              formData={formData}
              handleImageChange={handleImageChange}
              handleInputChange={handleInputChange}
              setShowPasswordModal={setShowPasswordModal}
            />

            <ActionButtons
              onCancel={handleCancel}
              onSave={handleSave}
            />
          </div>
        </div>

        <ProfileSidebar
          user={user}
          onUpdatePicture={() => profilePictureRef.current?.triggerFileInput()}
          onChangePassword={() => setShowPasswordModal(true)}
        />
      </div>

      <PasswordModal
        showPasswordModal={showPasswordModal}
        passwordData={passwordData}
        showCurrentPassword={showCurrentPassword}
        showNewPassword={showNewPassword}
        showConfirmPassword={showConfirmPassword}
        passwordError={passwordError}
        onClose={() => setShowPasswordModal(false)}
        onPasswordChange={handlePasswordChange}
        onPasswordUpdate={handlePasswordUpdate}
        onToggleCurrentPassword={() => setShowCurrentPassword(!showCurrentPassword)}
        onToggleNewPassword={() => setShowNewPassword(!showNewPassword)}
        onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />
    </>
  );
}
