interface AttendanceWarningModalProps {
  showWarning: boolean;
  onClose: () => void;
}

export default function AttendanceWarningModal({ showWarning, onClose }: AttendanceWarningModalProps) {
  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Attendance Already Taken</h3>
        </div>
        <p className="text-gray-600 mb-6">Your attendance has already been recorded for today. Please try again tomorrow.</p>
        <button
          onClick={onClose}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}