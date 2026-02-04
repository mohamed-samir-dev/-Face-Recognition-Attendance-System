import { useState, useEffect } from 'react';
import { AttendanceStats, DepartmentStats } from '@/components/admin';
import { getAttendanceStats, getDepartmentStats } from '@/lib/services/attendance/attendanceService';

export function useAttendanceData() {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceStats, deptStats] = await Promise.all([
          getAttendanceStats(),
          getDepartmentStats()
        ]);
        setStats(attendanceStats);
        setDepartmentStats(deptStats);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, departmentStats, loading };
}