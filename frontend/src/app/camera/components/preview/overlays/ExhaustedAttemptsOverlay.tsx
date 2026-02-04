import { AlertTriangle, Loader2 } from "lucide-react";

export default function ExhaustedAttemptsOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-red-50/90">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-2">
          Attempts Exhausted
        </h3>
        <p className="text-xs sm:text-sm text-[#555] mb-4 px-4">
          You have exhausted the number of attempts.
        </p>
        <p className="text-xs sm:text-sm text-[#555]">
          Please log in again.
        </p>
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-blue-600 text-sm font-medium">
            Redirecting...
          </span>
        </div>
      </div>
    </div>
  );
}