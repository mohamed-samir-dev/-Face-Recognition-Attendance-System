'use client';

import { UserFiltersProps } from '../../../admin/employee-management/types';
import {
  SearchInput,
  StatusFilter,
  SortSelector
} from '../../../admin/employee-management/components/user-management/filters/user-filters';

export default function SupervisorUserFilters({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  sortBy,
  setSortBy
}: Omit<UserFiltersProps, 'departmentFilter' | 'setDepartmentFilter' | 'departments'>) {
  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <StatusFilter filter={filter} setFilter={setFilter} />
        <SortSelector sortBy={sortBy} setSortBy={setSortBy} />
      </div>
    </div>
  );
}