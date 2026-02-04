'use client';

import { useAttendanceData } from '../hooks/data/useAttendanceData';
import LoadingState from './components/LoadingState';
import AttendanceGrid from './components/AttendanceGrid';

export default function AttendanceOverview() {
  const { departmentStats, absenceReasons, totalStats, loading } = useAttendanceData();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <AttendanceGrid 
      departmentStats={departmentStats}
      absenceReasons={absenceReasons}
      totalStats={totalStats}
    />
  );
}