import { UserCheck } from "lucide-react";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function AppLogo({ size = "md", showText = true }: AppLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6 sm:w-8 sm:h-8",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const iconSizes = {
    sm: "w-3 h-3 sm:w-4 sm:h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const textSizeClasses = {
    sm: "text-lg sm:text-xl",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg`}>
        <UserCheck className={`${iconSizes[size]} text-white`} />
      </div>
      {showText && (
        <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
          AttendanceAI
        </h1>
      )}
    </div>
  );
}