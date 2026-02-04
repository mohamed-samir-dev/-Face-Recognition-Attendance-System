import { useState } from "react";
import { DocumentData } from "firebase/firestore";
import { updateUser } from "@/lib/services/user/userService";

export const usePasswordModal = (user: DocumentData) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password: string) => {
    // Allow only English letters, numbers, and special characters
    const validPattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    return validPattern.test(password);
  };

  const validatePasswordStrength = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[a-zA-Z]/.test(password)) return "Password must contain English letters";
    if (!/[0-9]/.test(password)) return "Password must contain numbers";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "Password must contain special characters";
    return "";
  };

  const handlePasswordChange = (field: 'current' | 'new' | 'confirm', value: string) => {
    if (validatePassword(value)) {
      setPasswordData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordError("");
    
    if (passwordData.current !== user.password) {
      setPasswordError("Current password is incorrect");
      return;
    }
    
    const strengthError = validatePasswordStrength(passwordData.new);
    if (strengthError) {
      setPasswordError(strengthError);
      return;
    }
    
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    try {
      await updateUser(user.id, { password: passwordData.new });
      setShowPasswordModal(false);
      setPasswordData({ current: "", new: "", confirm: "" });
      setPasswordError("");
      setShowPasswordSuccess(true);
      setTimeout(() => setShowPasswordSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError("Failed to update password. Please try again.");
    }
  };

  return {
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
  };
};