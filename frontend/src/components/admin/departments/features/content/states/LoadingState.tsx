'use client';

export default function LoadingState() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm h-48 p-6">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}