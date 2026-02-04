import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PasswordFieldProps } from "../../types";

export default function PasswordField({ userPassword, onPasswordModalOpen }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mt-4 sm:mt-6">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:max-w-xs">
          <input
            type={showPassword ? "text" : "password"}
            value={
              showPassword
                ? userPassword || ""
                : "•".repeat((userPassword || "").length)
            }
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 pr-10 text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <button 
          onClick={onPasswordModalOpen}
          className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm cursor-pointer self-start sm:self-center"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}