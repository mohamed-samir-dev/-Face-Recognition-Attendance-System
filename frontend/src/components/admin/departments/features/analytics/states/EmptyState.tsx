'use client';

import { BarChart3 } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="text-center py-8 text-gray-500">
      <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <p>No department data available</p>
      <p className="text-sm">Create departments and assign employees to see analytics</p>
    </div>
  );
}