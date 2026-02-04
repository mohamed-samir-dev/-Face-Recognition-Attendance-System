import { X, Lock } from "lucide-react";

interface PasswordModalHeaderProps {
  onClose: () => void;
}

export default function PasswordModalHeader({ onClose }: PasswordModalHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Update Password</h3>
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