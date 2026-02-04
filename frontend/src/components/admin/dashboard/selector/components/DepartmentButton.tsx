
import {DepartmentButtonProps} from "../../types"
export default function DepartmentButton({ department, isSelected, onClick }: DepartmentButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isSelected
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {department}
    </button>
  );
}