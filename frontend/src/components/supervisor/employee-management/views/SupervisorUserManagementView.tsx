"use client";

import { Plus } from "lucide-react";
import { User } from "@/lib/types";
import {
  UserTable,
  UserCards,
  UserManagementLoadingState as LoadingState
} from '@/components/admin/employee-management/components';
import SupervisorUserFilters from '../components/SupervisorUserFilters';
import { DeleteModal, ChangePasswordModal } from '@/components/admin/employee-management/modals';
import { useSupervisorUserManagement } from '../hooks/useSupervisorUserManagement';
import { SupervisorDashboard } from '../../dashboard';

interface SupervisorUserManagementViewProps {
  user: User;
}

export default function SupervisorUserManagementView({ user }: SupervisorUserManagementViewProps) {
  const {
    users,
    departments,
    loading,
    filter,
    setFilter,
    departmentFilter,
    setDepartmentFilter,
    sortBy,
    setSortBy,
    deleting,
    deleteModal,
    changePasswordModal,
    changingPassword,
    searchTerm,
    setSearchTerm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleChangePasswordClick,
    handleChangePasswordConfirm,
    handleChangePasswordCancel,
    handleEdit,
    getStatusColor,
    getStatusText
  } = useSupervisorUserManagement(user);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Manage system users and their permissions
        </p>
      </div>

      <SupervisorDashboard user={user} />

      <SupervisorUserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <UserTable
        users={users}
        deleting={deleting}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onChangePassword={handleChangePasswordClick}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        hideDelete={true}
      />

      <UserCards
        users={users}
        deleting={deleting}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onChangePassword={handleChangePasswordClick}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        hideDelete={true}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        user={deleteModal.user}
        deleting={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <ChangePasswordModal
        isOpen={changePasswordModal.isOpen}
        user={changePasswordModal.user}
        loading={changingPassword}
        onConfirm={handleChangePasswordConfirm}
        onClose={handleChangePasswordCancel}
      />
    </div>
  );
}
