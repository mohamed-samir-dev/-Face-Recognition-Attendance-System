import { DEPARTMENTS } from '../constants/departments';
import DepartmentButton from './DepartmentButton';
import {DepartmentListProps}from "../../types"


export default function DepartmentList({ selectedDepartment, onDepartmentChange }: DepartmentListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {DEPARTMENTS.map((dept) => (
        <DepartmentButton
          key={dept}
          department={dept}
          isSelected={selectedDepartment === dept}
          onClick={() => onDepartmentChange(dept)}
        />
      ))}
    </div>
  );
}