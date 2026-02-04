'use client';
import {StatusCellProps}from "../../../../../types"

export default function StatusCell({ status, getStatusColor, getStatusText }: StatusCellProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}
      >
        {getStatusText(status)}
      </span>
    </td>
  );
}