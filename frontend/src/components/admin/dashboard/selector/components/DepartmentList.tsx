import { useState, useEffect } from 'react';
import DepartmentButton from './DepartmentButton';
import {DepartmentListProps}from "../../types"
import { getCompanySettings } from '@/lib/services/system/settingsService';


export default function DepartmentList({ selectedDepartment, onDepartmentChange }: DepartmentListProps) {
  const [departments, setDepartments] = useState<string[]>(['All']);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const settings = await getCompanySettings();
        const deptNames = settings.departments.map(dept => dept.name);
        setDepartments(['All', ...deptNames]);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      {departments.map((dept) => (
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