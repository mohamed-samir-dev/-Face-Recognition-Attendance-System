import { CheckCircle2, Loader2 } from "lucide-react";

interface SuccessOverlayProps {
  recognizedUser: {
    name: string;
    username: string;
    numericId: string;
    department?: string;
    jobTitle?: string;
    image?: string;
  };
}

export default function SuccessOverlay({
  recognizedUser,
}: SuccessOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-green-50 p-2 sm:p-4">
      <div className="text-center px-2 sm:px-4 max-w-full">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#1A1A1A] mb-2">
          Welcome, {recognizedUser.name}!
        </h3>
        <div className="bg-white text-left rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm w-full max-w-[280px] sm:max-w-sm md:max-w-md mx-auto">
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            {recognizedUser.image && (
              <img
                src={recognizedUser.image}
                alt={recognizedUser.name}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-blue-200"
              />
            )}
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Name:</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                {recognizedUser.name}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Username:
              </span>
              <span className="text-xs sm:text-sm font-semibold text-blue-700 truncate">
                @{recognizedUser.username}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">ID:</span>
              <span className="text-xs sm:text-sm font-semibold text-green-700">
                {recognizedUser.numericId}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Department:
              </span>
              <span className="text-xs sm:text-sm font-semibold text-purple-700 truncate">
                {recognizedUser.department || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Position:
              </span>
              <span className="text-xs sm:text-sm font-semibold text-orange-700 truncate">
                {recognizedUser.jobTitle || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 animate-spin" />
          <span className="text-blue-600 text-xs sm:text-sm font-medium">
            Redirecting to dashboard...
          </span>
        </div>
      </div>
    </div>
  );
}
