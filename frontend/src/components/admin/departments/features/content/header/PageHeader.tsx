'use client';

import { Building } from 'lucide-react';

export default function PageHeader() {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
        <Building className="w-8 h-8 text-blue-600" />
        Department Management
      </h1>
      <p className="text-gray-600">Manage organizational departments, assignments, and analytics</p>
    </div>
  );
}