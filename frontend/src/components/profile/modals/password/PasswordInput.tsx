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
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 pr-9 sm:pr-10 lg:pr-12 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-900 text-xs sm:text-sm lg:text-base"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          ) : (
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          )}
        </button>
      </div>
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}