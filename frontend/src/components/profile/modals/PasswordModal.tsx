import { PasswordModalProps } from "../types";
import {
  PasswordInput,
  PasswordModalHeader,
  PasswordModalActions,
  PasswordErrorMessage,
} from "./password";

export default function PasswordModal({
  showPasswordModal,
  passwordData,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  passwordError,
  onClose,
  onPasswordChange,
  onPasswordUpdate,
  onToggleCurrentPassword,
  onToggleNewPassword,
  onToggleConfirmPassword,
}: PasswordModalProps) {
  if (!showPasswordModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 w-full max-w-lg">
        <div className="p-4 sm:p-6">
          <PasswordModalHeader onClose={onClose} />
          
          <div className="space-y-3 sm:space-y-4">
            <PasswordInput
              label="Current Password"
              value={passwordData.current}
              placeholder="Enter current password"
              showPassword={showCurrentPassword}
              onChange={(value) => onPasswordChange('current', value)}
              onToggleVisibility={onToggleCurrentPassword}
            />
            
            <PasswordInput
              label="New Password"
              value={passwordData.new}
              placeholder="Enter new password"
              showPassword={showNewPassword}
              onChange={(value) => onPasswordChange('new', value)}
              onToggleVisibility={onToggleNewPassword}
              helperText="Only lowercase letters, numbers, and special characters allowed"
            />
            
            <PasswordInput
              label="Confirm New Password"
              value={passwordData.confirm}
              placeholder="Confirm new password"
              showPassword={showConfirmPassword}
              onChange={(value) => onPasswordChange('confirm', value)}
              onToggleVisibility={onToggleConfirmPassword}
            />
          </div>
          
          <PasswordErrorMessage error={passwordError} />
          
          <PasswordModalActions onClose={onClose} onUpdate={onPasswordUpdate} />
        </div>
      </div>
    </div>
  );
}