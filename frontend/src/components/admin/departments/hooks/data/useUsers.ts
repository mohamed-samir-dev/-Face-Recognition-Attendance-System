'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { getUsers } from '@/lib/services/user/userService';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const userData = await getUsers();
      setUsers(userData.filter((user) => user.numericId !== 1));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users };
}