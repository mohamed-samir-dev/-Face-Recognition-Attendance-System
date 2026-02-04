'use client';

interface SuccessModalProps {
  show: boolean;
}

export default function SuccessModal({ show }: SuccessModalProps) {
  if (!show) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 lg:p-6 flex items-center space-x-3 lg:space-x-4 max-w-sm lg:min-w-80">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h4 className="text-base lg:text-lg font-semibold text-gray-900">Changes Saved Successfully</h4>
          <p className="text-xs lg:text-sm text-gray-600">Employee profile has been updated and saved to the system</p>
        </div>
      </div>
    </div>
  );
}