'use client';

import { UserFiltersProps } from '../../../types';
import {
  SearchInput,
  StatusFilter,
  DepartmentFilter,
  SortSelector
} from './user-filters';


export default function UserFilters({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  departmentFilter,
  setDepartmentFilter,
  sortBy,
  setSortBy,
  departments
}: UserFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <StatusFilter filter={filter} setFilter={setFilter} />
        <DepartmentFilter 
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          departments={departments}
        />
        <SortSelector sortBy={sortBy} setSortBy={setSortBy} />
      </div>
    </div>
  );
}