import { FormInputProps } from "../../types";

export default function FormInput({ type, value, onChange, placeholder, error, disabled }: FormInputProps) {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base text-gray-900 placeholder-gray-500 hover:border-gray-400"
        placeholder={placeholder}
        required
        disabled={disabled}
      />
      {error && (
        <p className="text-red-600 text-xs sm:text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
