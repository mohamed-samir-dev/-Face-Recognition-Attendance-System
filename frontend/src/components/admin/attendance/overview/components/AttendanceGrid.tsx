'use client';
import DepartmentAttendance from '../../status/components/DepartmentAttendance';
import AttendanceStatus from '../../status/components/AttendanceStatus';
import QuickActions from '../../actions/QuickActions';
import AbsenceReasons from '../../reasons/AbsenceReasons';
import {AttendanceGridProps}from "../../types"


export default function AttendanceGrid({ departmentStats, absenceReasons, totalStats }: AttendanceGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <DepartmentAttendance departmentStats={departmentStats} />
      <AttendanceStatus present={totalStats.present} total={totalStats.total} />
      <QuickActions />
      <AbsenceReasons absenceReasons={absenceReasons} />
    </div>
  );
}