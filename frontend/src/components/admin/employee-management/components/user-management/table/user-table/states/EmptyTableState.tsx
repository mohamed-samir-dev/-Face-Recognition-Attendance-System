'use client';

export default function EmptyTableState() {
  return (
    <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="text-center py-8 text-gray-500">
        No users found matching the current filter.
      </div>
    </div>
  );
}