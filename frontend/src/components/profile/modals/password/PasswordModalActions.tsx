interface PasswordModalActionsProps {
  onClose: () => void;
  onUpdate: () => void;
}

export default function PasswordModalActions({ onClose, onUpdate }: PasswordModalActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
      <button
        onClick={onClose}
        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors rounded-lg hover:bg-gray-100 text-sm sm:text-base w-full sm:w-auto"
      >
        Cancel
      </button>
      <button
        onClick={onUpdate}
        className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-lg text-sm sm:text-base w-full sm:w-auto"
      >
        Update
      </button>
    </div>
  );
}