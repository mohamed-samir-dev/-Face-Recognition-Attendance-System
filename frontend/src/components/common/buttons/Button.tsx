import { ButtonProps } from "../types";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = ""
}: ButtonProps) {
  const baseClasses = "font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-4 focus:ring-gray-200",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-200"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}