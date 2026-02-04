'use client';
import {StatusBadgeProps} from "../../../../../types"

export default function StatusBadge({ status, getStatusColor, getStatusText }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}
    >
      {getStatusText(status)}
    </span>
  );
}