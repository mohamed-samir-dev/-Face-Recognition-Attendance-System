'use client';

import { Users } from 'lucide-react';
import {
  AssignmentForm,
  SearchBar,
  UnassignedUsers,
  DepartmentList,
  AssignmentLoadingState as LoadingState
} from '../components';
import { useUserAssignment } from '../hooks';

interface UserDepartmentAssignmentViewProps {
  onAssignmentChange?: () => void;
}

export default function UserDepartmentAssignmentView({ onAssignmentChange }: UserDepartmentAssignmentViewProps) {
  const {
    users,
    departments,
    loading,
    searchQuery,
    setSearchQuery,
    selectedUser,
    setSelectedUser,
    selectedDepartment,
    setSelectedDepartment,
    handleAssignUser,
    handleRemoveUser,
    unassignedUsers
  } = useUserAssignment(onAssignmentChange);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-blue-600" />
          User Department Assignment
        </h3>
        <p className="text-sm text-gray-600">Assign employees to departments and manage organizational structure</p>
      </div>

      <AssignmentForm
        users={users}
        departments={departments}
        selectedUser={selectedUser}
        selectedDepartment={selectedDepartment}
        onUserSelect={setSelectedUser}
        onDepartmentSelect={setSelectedDepartment}
        onAssign={handleAssignUser}
      />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="space-y-6">
        <UnassignedUsers users={unassignedUsers} />
        
        <DepartmentList
          departments={departments}
          users={users}
          searchQuery={searchQuery}
          onRemoveUser={handleRemoveUser}
        />
      </div>
    </div>
  );
}