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
    <div className="flex flex-col gap-3 mb-4 sm:mb-6">
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatusFilter filter={filter} setFilter={setFilter} />
        <DepartmentFilter 
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          departments={departments}
        />
        <div className="col-span-2 sm:col-span-1">
          <SortSelector sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>
    </div>
  );
}