import { AlertCircle } from "lucide-react";

interface PendingAlertProps {
  pendingCount: number;
}

export function PendingAlert({ pendingCount }: PendingAlertProps) {
  if (pendingCount === 0) return null;

  return (
    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center gap-2 text-amber-700 text-sm font-medium">
        <AlertCircle className="w-4 h-4" />
        {pendingCount} pending request{pendingCount > 1 ? "s" : ""}
      </div>
    </div>
  );
}