import { FormInputProps } from "../../types";

export default function FormInput({ type, value, onChange, placeholder, error, disabled }: FormInputProps) {
  const inputId = `input-${placeholder?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 md:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base text-gray-900 placeholder-gray-400 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
        placeholder={placeholder}
        required
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-red-600 text-xs sm:text-sm mt-1 px-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
