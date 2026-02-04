'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, deleteUser } from '@/lib/services/user/userService';
import { updateUserPassword, sendPasswordChangeEmail } from '@/lib/services/user/passwordService';
import { getCompanySettings } from '@/lib/services/system/settingsService';
import { isEmployeeOnLeave } from '@/lib/services/leave/leaveStatusService';
import { User } from '@/lib/types';
import { Department } from '@/components/admin/departments/types';
import toast from 'react-hot-toast';

export function useSupervisorUserManagement(supervisorUser: User) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("id");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });
  const [changePasswordModal, setChangePasswordModal] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });
  const [changingPassword, setChangingPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, settingsData] = await Promise.all([
          getUsers(),
          getCompanySettings()
        ]);
        
        const usersWithLeaveStatus = await Promise.all(
          userData.map(async (user: User) => {
            if (user.numericId && user.numericId !== 1) {
              const onLeave = await isEmployeeOnLeave(user.numericId.toString());
              return {
                ...user,
                status: onLeave ? 'OnLeave' : (user.status || 'Active')
              };
            }
            return user;
          })
        );
        
        setUsers(usersWithLeaveStatus);
        setDepartments(settingsData.departments);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (user: User) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.user) return;
    
    setDeleting(deleteModal.user.id);
    try {
      await deleteUser(deleteModal.user.id);
      const userData = await getUsers();
      setUsers(userData);
      setDeleteModal({ isOpen: false, user: null });
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleEdit = (userId: string) => {
    router.push(`/supervisor/edit-employee?id=${userId}`);
  };

  const handleChangePasswordClick = (user: User) => {
    setChangePasswordModal({ isOpen: true, user });
  };

  const handleChangePasswordConfirm = async (newPassword: string) => {
    if (!changePasswordModal.user) return;
    
    setChangingPassword(true);
    try {
      await updateUserPassword(changePasswordModal.user.id, newPassword);
      await sendPasswordChangeEmail(changePasswordModal.user, newPassword);
      
      toast.success(`Password changed successfully for ${changePasswordModal.user.name}. Email sent to ${changePasswordModal.user.email}`);
      setChangePasswordModal({ isOpen: false, user: null });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error changing password. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleChangePasswordCancel = () => {
    setChangePasswordModal({ isOpen: false, user: null });
  };

  const supervisorDepartment = supervisorUser.department || supervisorUser.Department || "";

  const filteredUsers = users.filter((user) => {
    if (user.numericId === 1) return false;
    if (user.id === supervisorUser.id) return false;
    
    // Filter by supervisor's department
    const userDept = user.department || user.Department || "";
    if (userDept !== supervisorDepartment) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(searchLower);
      const matchesId = user.numericId?.toString().includes(searchTerm);
      if (!matchesName && !matchesId) return false;
    }
    
    if (filter !== "All" && user.status !== filter) return false;
    
    if (departmentFilter !== "All") {
      if (departmentFilter === "Unassigned" && userDept !== "") return false;
      if (departmentFilter !== "Unassigned" && userDept !== departmentFilter) return false;
    }
    
    return true;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "id") return (a.numericId || 0) - (b.numericId || 0);
    if (sortBy === "department")
      return (a.Department || a.department || "").localeCompare(
        b.Department || b.department || ""
      );
    return 0;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "OnLeave":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "OnLeave":
        return "On Leave";
      default:
        return status || "Active";
    }
  };

  return {
    users: sortedUsers,
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
  };
}
