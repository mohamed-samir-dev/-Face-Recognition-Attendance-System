import { Eye, EyeOff } from "lucide-react";
import {PasswordInputProps}from "../../types"


export default function PasswordInput({
  label,
  value,
  placeholder,
  showPassword,
  onChange,
  onToggleVisibility,
  helperText,
}: PasswordInputProps) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-900 text-sm sm:text-base"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}