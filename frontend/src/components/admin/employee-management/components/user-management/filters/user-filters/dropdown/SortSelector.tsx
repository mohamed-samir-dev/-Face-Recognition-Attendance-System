'use client';

import { ArrowUpDown } from 'lucide-react';

interface SortSelectorProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function SortSelector({ sortBy, setSortBy }: SortSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <ArrowUpDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="name">Sort by Name</option>
        <option value="id">Sort by ID</option>
        <option value="department">Sort by Department</option>
      </select>
    </div>
  );
}