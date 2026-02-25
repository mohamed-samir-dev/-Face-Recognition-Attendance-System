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
    <div className="absolute inset-0 flex items-center justify-center bg-green-50">
      <div className="text-center p-4">
        <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mt-2">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-2">
          Welcome, {recognizedUser.name}!
        </h3>
        <div className="bg-white text-left rounded-lg p-4 mb-4 shadow-sm min-w-[400px] max-w-[700px] mx-auto">
          <div className="flex items-center justify-center mb-3">
            {recognizedUser.image && (
              <img
                src={recognizedUser.image}
                alt={recognizedUser.name}
                className="w-15 h-15 rounded-full object-cover ring-2 ring-blue-200"
              />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Name:</span>
              <span className="text-sm font-semibold text-gray-800">
                {recognizedUser.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Username:
              </span>
              <span className="text-sm font-semibold text-blue-700">
                @{recognizedUser.username}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">ID:</span>
              <span className="text-sm font-semibold text-green-700">
                {recognizedUser.numericId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Department:
              </span>
              <span className="text-sm font-semibold text-purple-700">
                {recognizedUser.department || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Position:
              </span>
              <span className="text-sm font-semibold text-orange-700">
                {recognizedUser.jobTitle || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-blue-600 text-sm font-medium">
            Redirecting to dashboard...
          </span>
        </div>
      </div>
    </div>
  );
}
