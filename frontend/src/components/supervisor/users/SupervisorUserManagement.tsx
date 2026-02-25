"use client";

import { useState, useEffect, useCallback } from "react";
import { User as UserIcon, Building2, Mail, Phone, Briefcase } from "lucide-react";
import { User } from "@/lib/types";
import { getUsers } from "@/lib/services/user/userService";
import { SupervisorDashboard } from "../dashboard";

interface SupervisorUserManagementProps {
  user: User;
}

export default function SupervisorUserManagement({ user }: SupervisorUserManagementProps) {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadEmployees = useCallback(async () => {
    try {
      const allUsers = await getUsers();
      const managedEmployees = allUsers.filter(
        (u) => u.department === user.department && u.accountType === "Employee"
      );
      setEmployees(managedEmployees);
    } catch (error) {
      console.error("Error loading employees:", error);
    } finally {
      setLoading(false);
    }
  }, [user.department]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage employees in your department</p>
      </div>

      <SupervisorDashboard user={user} />

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
        />
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Employees Found</h3>
          <p className="text-gray-500">No employees in your department.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                  {employee.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-500">ID: #{employee.numericId}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {employee.jobTitle && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{employee.jobTitle}</span>
                  </div>
                )}
                {employee.department && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>{employee.department}</span>
                  </div>
                )}
                {employee.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                )}
                {employee.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  employee.status === "Active" ? "bg-green-100 text-green-800" :
                  employee.status === "OnLeave" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {employee.status || "Active"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
