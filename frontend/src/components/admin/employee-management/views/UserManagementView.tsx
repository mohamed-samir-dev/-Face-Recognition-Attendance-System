"use client";

import { Plus } from "lucide-react";
import {
  UserFilters,
  UserTable,
  UserCards,
  UserManagementLoadingState as LoadingState
} from '../components';
import { DeleteModal, ChangePasswordModal } from '../modals';
import { useUserManagement } from '../hooks';

export default function UserManagementView() {
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
  } = useUserManagement();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage system users and their permissions
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/admin/add-employee'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Add New Employee</span>
          <span className="xs:hidden">Add Employee</span>
        </button>
      </div>

      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        departments={departments}
      />

      <UserTable
        users={users}
        deleting={deleting}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onChangePassword={handleChangePasswordClick}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />

      <UserCards
        users={users}
        deleting={deleting}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onChangePassword={handleChangePasswordClick}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
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