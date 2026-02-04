"use client";

import { useAttendanceData } from "./useAttendanceData";
import { useDepartmentFilter } from "./useDepartmentFilter";

export function useDashboardData() {
  const { stats, departmentStats, loading } = useAttendanceData();
  const { selectedDepartment, setSelectedDepartment, currentStats } =
    useDepartmentFilter(stats, departmentStats);

  return {
    stats,
    departmentStats,
    loading,
    selectedDepartment,
    setSelectedDepartment,
    currentStats,
  };
}
