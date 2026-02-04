'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, Key, Shield, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { User } from '@/lib/types';

interface ChangePasswordModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (newPassword: string) => void;
  loading: boolean;
}

export default function ChangePasswordModal({ 
  isOpen, 
  user, 
  onClose, 
  onConfirm, 
  loading 
}: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validatePassword = (password: string) => {
    const errors: {[key: string]: string} = {};
    
    if (password.length < 8) {
      errors.length = 'Password must be at least 8 characters long';
    }
    
    if (!/[a-zA-Z]/.test(password)) {
      errors.letters = 'Password must contain English letters';
    }
    
    if (!/\d/.test(password)) {
      errors.numbers = 'Password must contain numbers';
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.special = 'Password must contain special characters';
    }
    
    return errors;
  };

  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      letters: /[a-zA-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordErrors = validatePassword(newPassword);
    const formErrors: {[key: string]: string} = { ...passwordErrors };
    
    if (newPassword !== confirmPassword) {
      formErrors.match = 'Passwords do not match';
    }
    
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length === 0) {
      onConfirm(newPassword);
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  const { checks, score } = getPasswordStrength(newPassword);
  const strengthColor = score === 4 ? 'text-green-600' : score >= 2 ? 'text-yellow-600' : 'text-red-600';
  const strengthBg = score === 4 ? 'bg-green-100' : score >= 2 ? 'bg-yellow-100' : 'bg-red-100';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Change Password</h3>
              <p className="text-emerald-100 text-sm">Update employee credentials</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* User Info */}
          {user && (
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Lock className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Updating password for</p>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all pl-12"
                  placeholder="Enter new password"
                  required
                />
                <Key className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className={`mt-3 p-3 rounded-lg ${strengthBg}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className={`w-4 h-4 ${strengthColor}`} />
                    <span className={`text-sm font-medium ${strengthColor}`}>
                      Password Strength: {score === 4 ? 'Strong' : score >= 2 ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center space-x-1 ${checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                      {checks.length ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${checks.letters ? 'text-green-600' : 'text-gray-400'}`}>
                      {checks.letters ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>Letters</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${checks.numbers ? 'text-green-600' : 'text-gray-400'}`}>
                      {checks.numbers ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>Numbers</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${checks.special ? 'text-green-600' : 'text-gray-400'}`}>
                      {checks.special ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>Special chars</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 border-2 text-black rounded-xl transition-all pl-12 ${
                    confirmPassword && newPassword === confirmPassword 
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500' 
                      : 'border-gray-200 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                  placeholder="Confirm new password"
                  required
                />
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword === confirmPassword && (
                <div className="flex items-center space-x-1 mt-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Passwords match</span>
                </div>
              )}
              {errors.match && <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.match}</span>
              </p>}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || score < 4 || newPassword !== confirmPassword}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Update Password</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}