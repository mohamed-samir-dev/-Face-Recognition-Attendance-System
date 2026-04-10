
import {DepartmentButtonProps} from "../../types"
export default function DepartmentButton({ department, isSelected, onClick }: DepartmentButtonProps) {
  return (
      <button
      onClick={onClick}
      className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg font-medium transition-colors ${
        isSelected
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {department}
    </button>
  );
}