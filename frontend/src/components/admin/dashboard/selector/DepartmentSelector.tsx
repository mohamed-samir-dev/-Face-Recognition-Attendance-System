import { DepartmentSelectorProps } from '../types';
import DepartmentList from './components/DepartmentList';

export default function DepartmentSelector({ selectedDepartment, onDepartmentChange }: DepartmentSelectorProps) {
  return (
    <div className="mb-4 sm:mb-6 lg:mb-8">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Team / Department</h2>
      <DepartmentList 
        selectedDepartment={selectedDepartment}
        onDepartmentChange={onDepartmentChange}
      />
    </div>
  );
}