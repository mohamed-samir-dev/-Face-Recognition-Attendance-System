'use client';

import { useState, useEffect } from 'react';
import { FileText, Users, UserCheck } from 'lucide-react';
import { getUsers } from '@/lib/services/user/userService';
import { User } from '@/lib/types';
import EmployeeReportModal from '@/components/dashboard/reports/EmployeeReportModal';

type TabType = 'all' | 'employee' | 'supervisor';

export default function ReportsContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const fetchUsers = async () => {
    const allUsers = await getUsers();
    const filtered = allUsers.filter(u => u.accountType !== 'Admin');
    setUsers(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      fetchUsers();
    }
  }, [selectedUser]);

  const filteredUsers = users.filter(user => {
    if (activeTab === 'all') return true;
    if (activeTab === 'employee') return user.accountType === 'Employee';
    if (activeTab === 'supervisor') return user.accountType === 'Supervisor';
    return true;
  });

  const employeeCount = users.filter(u => u.accountType === 'Employee').length;
  const supervisorCount = users.filter(u => u.accountType === 'Supervisor').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Reports</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage attendance reports for all staff members</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            <p className="text-xs text-gray-600 mt-1">Total Staff</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{employeeCount}</p>
            <p className="text-xs text-gray-600 mt-1">Employees</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{supervisorCount}</p>
            <p className="text-xs text-gray-600 mt-1">Supervisors</p>
          </div>
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
            <Users className="w-4 h-4" />
            All Staff ({users.length})
          </button>
          
          <button
            onClick={() => setActiveTab('employee')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'employee'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Employees ({employeeCount})
          </button>
          
          <button
            onClick={() => setActiveTab('supervisor')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'supervisor'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Supervisors ({supervisorCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No {activeTab === 'employee' ? 'Employees' : activeTab === 'supervisor' ? 'Supervisors' : 'Staff'} Found</h3>
            <p className="text-gray-500">There are no {activeTab === 'all' ? 'staff members' : activeTab === 'employee' ? 'employees' : 'supervisors'} to display.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === 'all' ? 'All Staff' : activeTab === 'employee' ? 'Employee' : 'Supervisor'} List
              </h2>
              <p className="text-xs text-gray-500 mt-1">{filteredUsers.length} {activeTab === 'all' ? 'staff members' : activeTab === 'employee' ? 'employees' : 'supervisors'} found</p>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{user.numericId}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{user.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {user.department || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        user.accountType === 'Supervisor' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.accountType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {selectedUser && (
        <EmployeeReportModal
          employee={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      </div>
    </div>
  );
}