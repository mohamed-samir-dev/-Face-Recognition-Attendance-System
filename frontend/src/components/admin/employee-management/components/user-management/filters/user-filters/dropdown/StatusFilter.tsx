'use client';

import { Filter } from 'lucide-react';

interface StatusFilterProps {
  filter: string;
  setFilter: (filter: string) => void;
}

export default function StatusFilter({ filter, setFilter }: StatusFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="OnLeave">On Leave</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}