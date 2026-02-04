
import {StatusTabProps}from "../../../../types"
export default function StatusTab({ tab, isActive, count, badgeColor, onClick }: StatusTabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
        isActive
          ? "bg-gray-100 text-blue-600 shadow-sm"
          : "text-gray-600 hover:text-gray-800"
      }`}
    >
      <span>{tab}</span>
      <span className={`${badgeColor} px-2 py-1 rounded-full text-xs font-semibold`}>{count}</span>
    </button>
  );
}