'use client';

import { User, Mail, Building, Briefcase, DollarSign, Shield, AtSign, Lock } from 'lucide-react';
import { InputField, SelectField, DisabledField } from './components';
import {BasicInfoFieldsProps}from "../../../types"
import {departmentOptions} from "./data/data"

const roleOptions = [
  { value: 'Employee', label: 'Employee' },
  { value: 'Supervisor', label: 'Supervisor' },
];

export default function BasicInfoFields({ formData, setFormData, generatedUsername, onNameChange }: BasicInfoFieldsProps) {
  const handleNameChange = (value: string) => {
    // Only allow English letters and spaces
    const englishOnly = /^[a-zA-Z\s]*$/;
    if (value === '' || englishOnly.test(value)) {
      setFormData({ ...formData, name: value });
      if (onNameChange) {
        onNameChange(value);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <InputField
        label="Full Name"
        icon={User}
        value={formData.name}
        onChange={handleNameChange}
        placeholder="Enter full name"
        required
      />
      
      {generatedUsername && (
        <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AtSign className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">Generated Username</p>
            <p className="text-sm text-blue-700 font-mono">{generatedUsername}</p>
          </div>
        </div>
      )}
      <InputField
        label="Email"
        icon={Mail}
        type="email"
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        placeholder="Enter email address"
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
        placeholder="Enter job title"
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
        placeholder="Enter salary amount"
        min="0"
        required
      />
      <InputField
        label="Password"
        icon={Lock}
        type="number"
        value={formData.password || ''}
        onChange={(value) => setFormData({ ...formData, password: value })}
        placeholder="Enter numeric password"
        required
      />
    </div>
  );
}