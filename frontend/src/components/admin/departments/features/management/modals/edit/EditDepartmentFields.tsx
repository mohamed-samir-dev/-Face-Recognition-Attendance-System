'use client';
import {EditDepartmentFieldsProps}from "../../../../types"
import EditNameField from './fields/name/EditNameField';
import EditHeadField from './fields/head/EditHeadField';
import EditLocationField from './fields/location/EditLocationField';
import EditBudgetField from './fields/budget/EditBudgetField';
import EditDescriptionField from './fields/description/EditDescriptionField';



export default function EditDepartmentFields({ editingDept, setEditingDept, users }: EditDepartmentFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <EditNameField
        value={editingDept.name}
        onChange={(value) => setEditingDept(prev => prev ? { ...prev, name: value } : null)}
      />

      <EditHeadField
        headId={editingDept.headId || ""}
        users={users}
        onChange={(headId, headName) => setEditingDept(prev => prev ? { ...prev, headId, head: headName } : null)}
      />

      <EditLocationField
        value={editingDept.location || ""}
        onChange={(value) => setEditingDept(prev => prev ? { ...prev, location: value } : null)}
      />

      <EditBudgetField
        value={editingDept.budget}
        onChange={(value) => setEditingDept(prev => prev ? { ...prev, budget: value } : null)}
      />

      <div className="md:col-span-2">
        <EditDescriptionField
          value={editingDept.description || ""}
          onChange={(value) => setEditingDept(prev => prev ? { ...prev, description: value } : null)}
        />
      </div>
    </div>
  );
}