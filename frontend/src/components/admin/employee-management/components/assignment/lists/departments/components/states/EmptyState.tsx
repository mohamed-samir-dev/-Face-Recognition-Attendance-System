'use client';

import { Building } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="text-center py-8 text-gray-500">
      <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <p>No departments created yet</p>
      <p className="text-sm">Create departments first to assign users</p>
    </div>
  );
}