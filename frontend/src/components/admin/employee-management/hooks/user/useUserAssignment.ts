'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { Department } from '@/components/admin/departments/types';
import { getUsers, assignUserToDepartment, removeUserFromDepartment } from '@/lib/services/user/userService';
import { getCompanySettings } from '@/lib/services/system/settingsService';

export function useUserAssignment(onAssignmentChange?: () => void) {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userData, settingsData] = await Promise.all([
        getUsers(),
        getCompanySettings()
      ]);
      
      setUsers(userData.filter((user: User) => user.numericId !== 1)); // Exclude admin
      setDepartments(settingsData.departments);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignUser = async () => {
    if (!selectedUser || !selectedDepartment) return;

    try {
      await assignUserToDepartment(selectedUser.id, selectedDepartment);
      await fetchData();
      setSelectedUser(null);
      setSelectedDepartment('');
      onAssignmentChange?.();
    } catch (error) {
      console.error('Error assigning user:', error);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUserFromDepartment(userId);
      await fetchData();
      onAssignmentChange?.();
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const unassignedUsers = users.filter(user => !user.department && !user.Department);

  return {
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
  };
}