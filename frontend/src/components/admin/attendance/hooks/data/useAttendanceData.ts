import { useState, useEffect } from 'react';
import { DepartmentStats, AbsenceReason } from '../../types';
import { getDepartmentStats, getAbsenceReasons, getAttendanceStats } from '@/lib/services/attendance/attendanceService';

export function useAttendanceData() {
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [absenceReasons, setAbsenceReasons] = useState<AbsenceReason[]>([]);
  const [totalStats, setTotalStats] = useState({ present: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptStats, reasons, stats] = await Promise.all([
          getDepartmentStats(),
          getAbsenceReasons(),
          getAttendanceStats()
        ]);
        setDepartmentStats(deptStats);
        setAbsenceReasons(reasons);
        setTotalStats({ present: stats.presentToday, total: stats.totalMembers });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { departmentStats, absenceReasons, totalStats, loading };
}