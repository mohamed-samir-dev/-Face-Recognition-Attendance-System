'use client';

export default function EmptyState() {
  return (
    <div className="lg:hidden">
      <div className="text-center py-8 text-gray-500">
        No users found matching the current filter.
      </div>
    </div>
  );
}