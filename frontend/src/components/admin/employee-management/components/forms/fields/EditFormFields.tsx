'use client';

import { User, Building, Mail, Briefcase, DollarSign, Shield, UserCheck } from 'lucide-react';
import { InputField, SelectField, DisabledField } from './components';
import {EditFormFieldsProps}from "../../../types"
import {departmentOptions} from "./data/data"

const roleOptions = [
  { value: 'Employee', label: 'Employee' },
  { value: 'Supervisor', label: 'Supervisor' },

];

export default function EditFormFields({ formData, setFormData }: EditFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <InputField
        label="Employee Name"
        icon={User}
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
        placeholder=""
        required
      />
      <DisabledField
        label="Employee ID"
        value=""
      />
      <InputField
        label="Email"
        icon={Mail}
        type="email"
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        placeholder=""
        required
      />
      <SelectField
        label="Department"
        icon={Building}
        value={formData.department}
        onChange={(value) => setFormData({ ...formData, department: value })}
        options={departmentOptions}
        required
      />
      {formData.role !== 'Supervisor' && (
        <DisabledField
          label="Supervisor"
          value={formData.supervisor || 'Auto-filled based on department'}
        />
      )}
      <InputField
        label="Job Title"
        icon={Briefcase}
        value={formData.jobTitle}
        onChange={(value) => setFormData({ ...formData, jobTitle: value })}
        placeholder=""
        required
      />
      <SelectField
        label="Role"
        icon={Shield}
        value={formData.role || 'Employee'}
        onChange={(value) => setFormData({ ...formData, role: value })}
        options={roleOptions}
        required
      />
      <InputField
        label="Salary"
        icon={DollarSign}
        type="number"
        value={formData.salary}
        onChange={(value) => setFormData({ ...formData, salary: value })}
        placeholder=""
        min="0"
        required
      />
    </div>
  );
}