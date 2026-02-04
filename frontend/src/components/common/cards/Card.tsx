import { CardProps } from "../types";

export default function Card({ children, className = "", padding = "md" }: CardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6 sm:p-8",
    lg: "p-8 sm:p-12"
  };

  return (
    <div className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}