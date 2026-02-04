'use client';

import { useEffect, useCallback } from 'react';
import { Department } from '../../types';
import { updateDepartmentEmployeeCount } from '@/lib/services/system/settingsService';

export function useDepartmentEmployeeCount(departments: Department[]) {
  const updateEmployeeCounts = useCallback(async () => {
    for (const dept of departments) {
      await updateDepartmentEmployeeCount(dept.id);
    }
  }, [departments]);

  useEffect(() => {
    updateEmployeeCounts();
  }, [departments, updateEmployeeCounts]);

  return { updateEmployeeCounts };
}