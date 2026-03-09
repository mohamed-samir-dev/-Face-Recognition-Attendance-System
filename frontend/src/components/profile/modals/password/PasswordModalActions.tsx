interface PasswordModalActionsProps {
  onClose: () => void;
  onUpdate: () => void;
}

export default function PasswordModalActions({ onClose, onUpdate }: PasswordModalActionsProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-3 sm:mt-4 lg:mt-6">
      <button
        onClick={onClose}
        className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors rounded-lg hover:bg-gray-100 text-xs sm:text-sm lg:text-base w-full sm:w-auto"
      >
        Cancel
      </button>
      <button
        onClick={onUpdate}
        className="px-4 sm:px-5 lg:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-lg text-xs sm:text-sm lg:text-base w-full sm:w-auto"
      >
        Update
      </button>
    </div>
  );
}