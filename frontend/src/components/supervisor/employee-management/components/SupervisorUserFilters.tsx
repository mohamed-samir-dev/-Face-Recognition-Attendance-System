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
    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <StatusFilter filter={filter} setFilter={setFilter} />
        <SortSelector sortBy={sortBy} setSortBy={setSortBy} />
      </div>
    </div>
  );
}