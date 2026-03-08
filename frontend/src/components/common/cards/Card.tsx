import { CardProps } from "../types";

export default function Card({ children, className = "", padding = "md" }: CardProps) {
  const paddingClasses = {
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6 md:p-8",
    lg: "p-6 sm:p-8 md:p-10 lg:p-12"
  };

  return (
    <div className={`bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl border border-gray-100 ${paddingClasses[padding]} ${className} transition-all duration-300 hover:shadow-2xl`}>
      {children}
    </div>
  );
}