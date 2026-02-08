"use client";

import { useState } from "react";
import { Plus, Download, Users, UserCog, UsersRound } from "lucide-react";
import {
  UserFilters,
  UserTable,
  UserCards,
  UserManagementLoadingState as LoadingState
} from '../components';
import { DeleteModal, ChangePasswordModal } from '../modals';
import { useUserManagement } from '../hooks';
import * as XLSX from 'xlsx';

export default function UserManagementView() {
  const [activeTab, setActiveTab] = useState<'all' | 'employees' | 'supervisors'>('all');
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

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);
    let currentRow = 0;

    XLSX.utils.sheet_add_aoa(ws, [['USER MANAGEMENT REPORT']], { origin: `A${currentRow + 1}` });
    currentRow += 2;
    
    const summaryData = [
      ['Total Users', users.length, 'Active Users', users.filter(u => u.status === 'Active').length],
      ['Inactive Users', users.filter(u => u.status === 'Inactive').length, 'On Leave', users.filter(u => u.status === 'OnLeave').length],
      ['Total Departments', departments.length, 'Report Date', new Date().toLocaleDateString()]
    ];
    XLSX.utils.sheet_add_aoa(ws, summaryData, { origin: `A${currentRow + 1}` });
    currentRow += summaryData.length + 2;

    XLSX.utils.sheet_add_aoa(ws, [['DETAILED USER LIST']], { origin: `A${currentRow + 1}` });
    currentRow += 2;
    
    const headers = [['ID', 'Name', 'Email', 'Phone', 'Department', 'Job Title', 'Account Type', 'Status']];
    XLSX.utils.sheet_add_aoa(ws, headers, { origin: `A${currentRow + 1}` });
    currentRow += 1;
    
    const userData = users.map(user => [
      user.numericId || 'N/A',
      user.name || 'N/A',
      user.email || 'N/A',
      user.phone || 'N/A',
      user.department || user.Department || 'N/A',
      user.jobTitle || 'N/A',
      user.accountType || 'N/A',
      user.status || 'N/A'
    ]);
    XLSX.utils.sheet_add_aoa(ws, userData, { origin: `A${currentRow + 1}` });

    ws['!cols'] = [
      { width: 10 }, { width: 20 }, { width: 25 }, { width: 15 },
      { width: 20 }, { width: 20 }, { width: 15 }, { width: 12 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'User Management');
    XLSX.writeFile(wb, `User_Management_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return <LoadingState />;
  }

  const employees = users.filter(u => u.accountType === 'Employee');
  const supervisors = users.filter(u => u.accountType === 'Supervisor');
  const displayUsers = activeTab === 'all' ? users : activeTab === 'employees' ? employees : supervisors;

  const activeUsers = displayUsers.filter(u => u.status === 'Active').length;
  const inactiveUsers = displayUsers.filter(u => u.status === 'Inactive').length;
  const onLeaveUsers = displayUsers.filter(u => u.status === 'OnLeave').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage system users and their permissions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
            <button 
              onClick={() => window.location.href = '/admin/add-employee'}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <UsersRound className="w-4 h-4" />
              All Staff ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'employees'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Employees ({employees.length})
            </button>
            <button
              onClick={() => setActiveTab('supervisors')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'supervisors'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <UserCog className="w-4 h-4" />
              Supervisors ({supervisors.length})
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {activeTab === 'all' ? 'All Staff' : activeTab === 'employees' ? 'Employee' : 'Supervisor'} Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{displayUsers.length}</p>
              <p className="text-xs text-gray-600 mt-1">Total {activeTab === 'all' ? 'Staff' : activeTab === 'employees' ? 'Employees' : 'Supervisors'}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              <p className="text-xs text-gray-600 mt-1">Active</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
              <p className="text-xs text-gray-600 mt-1">Inactive</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{onLeaveUsers}</p>
              <p className="text-xs text-gray-600 mt-1">On Leave</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
              <p className="text-xs text-gray-600 mt-1">Departments</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{displayUsers.length > 0 ? ((activeUsers / displayUsers.length) * 100).toFixed(0) : 0}%</p>
              <p className="text-xs text-gray-600 mt-1">Active Rate</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === 'all' ? 'All Staff' : activeTab === 'employees' ? 'Employee' : 'Supervisor'} List
            </h2>
            <p className="text-xs text-gray-500 mt-1">{displayUsers.length} {activeTab === 'all' ? 'staff members' : activeTab === 'employees' ? 'employees' : 'supervisors'} found</p>
          </div>
          <UserTable
            users={displayUsers}
            deleting={deleting}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onChangePassword={handleChangePasswordClick}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </div>

        {/* User Cards for Mobile */}
        <UserCards
          users={displayUsers}
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
    </div>
  );
}