'use client';

import {DepartmentFormFieldsProps } from "../../../../../types";
import DepartmentNameField from './name/DepartmentNameField';
import DepartmentHeadField from './head/DepartmentHeadField';
import DepartmentLocationField from './location/DepartmentLocationField';
import DepartmentBudgetField from './budget/DepartmentBudgetField';
import DepartmentDescriptionField from './description/DepartmentDescriptionField';



export default function DepartmentFormFields({ newDepartment, setNewDepartment, users }: DepartmentFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DepartmentNameField
        value={newDepartment.name}
        onChange={(value) => setNewDepartment(prev => ({ ...prev, name: value }))}
      />

      <DepartmentHeadField
        headId={newDepartment.headId}
        users={users}
        onChange={(headId, headName) => setNewDepartment(prev => ({ ...prev, headId, head: headName }))}
      />

      <DepartmentLocationField
        value={newDepartment.location}
        onChange={(value) => setNewDepartment(prev => ({ ...prev, location: value }))}
      />

      <DepartmentBudgetField
        value={newDepartment.budget}
        onChange={(value) => setNewDepartment(prev => ({ ...prev, budget: value }))}
      />

      <div className="md:col-span-2">
        <DepartmentDescriptionField
          value={newDepartment.description}
          onChange={(value) => setNewDepartment(prev => ({ ...prev, description: value }))}
        />
      </div>
    </div>
  );
}