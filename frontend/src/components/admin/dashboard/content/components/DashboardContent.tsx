import AttendanceOverview from '../../../attendance/overview/AttendanceOverview';
import DashboardHeader from '../../header/DashboardHeader';
import DepartmentSelector from '../../selector/DepartmentSelector';
import AttendanceSummary from '../../summary/AttendanceSummary';
import {DashboardContentProps} from "../../types"

export default function DashboardContent({ selectedDepartment, onDepartmentChange, currentStats }: DashboardContentProps) {
  return (
    <>
      <DashboardHeader />
      <DepartmentSelector 
        selectedDepartment={selectedDepartment} 
        onDepartmentChange={onDepartmentChange} 
      />
      <AttendanceSummary stats={currentStats} />
      <AttendanceOverview />
    </>
  );
}