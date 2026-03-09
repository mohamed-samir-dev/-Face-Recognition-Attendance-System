import { X, Lock } from "lucide-react";

interface PasswordModalHeaderProps {
  onClose: () => void;
}

export default function PasswordModalHeader({ onClose }: PasswordModalHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
        </div>
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Update Password</h3>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}