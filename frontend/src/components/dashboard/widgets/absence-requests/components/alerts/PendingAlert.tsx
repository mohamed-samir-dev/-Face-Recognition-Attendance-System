import { AlertCircle } from "lucide-react";

interface PendingAlertProps {
  pendingCount: number;
}

export function PendingAlert({ pendingCount }: PendingAlertProps) {
  if (pendingCount === 0) return null;

  return (
    <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center gap-1.5 sm:gap-2 text-amber-700 text-xs sm:text-sm font-medium">
        <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span>{pendingCount} pending request{pendingCount > 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}