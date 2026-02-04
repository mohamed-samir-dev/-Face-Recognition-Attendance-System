'use client';

import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { getUsers } from '@/lib/services/user/userService';
import { User } from '@/lib/types';
import EmployeeReportModal from '@/components/dashboard/reports/EmployeeReportModal';

export default function ReportsContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getUsers();
      const filtered = allUsers.filter(u => u.accountType !== 'Admin');
      setUsers(filtered);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Employee Reports</h1>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{user.numericId}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.department || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.accountType}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4" />
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <EmployeeReportModal
          employee={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}