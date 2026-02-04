import { useState } from 'react';
import { AttendanceStats, DepartmentStats } from '@/components/admin';

export function useDepartmentFilter(stats: AttendanceStats | null, departmentStats: DepartmentStats[]) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  const getCurrentStats = () => {
    if (selectedDepartment === 'All') {
      return stats;
    }
    return departmentStats.find(dept => dept.department === selectedDepartment) || null;
  };

  return {
    selectedDepartment,
    setSelectedDepartment,
    currentStats: getCurrentStats()
  };
}