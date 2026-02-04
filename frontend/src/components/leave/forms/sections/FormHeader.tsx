"use client";

export default function FormHeader() {
  return (
    <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        Leave Request Application
      </h1>
      <p className="text-sm sm:text-base text-gray-600">
        Please complete all required fields to submit your leave request for approval.
      </p>
    </div>
  );
}