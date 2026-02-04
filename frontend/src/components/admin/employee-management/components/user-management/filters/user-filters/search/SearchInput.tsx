'use client';

import { Search } from 'lucide-react';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchInput({ searchTerm, setSearchTerm }: SearchInputProps) {
  return (
    <div className="flex items-center space-x-2 flex-1">
      <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
      <input
        type="text"
        placeholder="Search by name or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}