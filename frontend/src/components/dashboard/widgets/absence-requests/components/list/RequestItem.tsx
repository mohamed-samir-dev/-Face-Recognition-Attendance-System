import { Clock } from "lucide-react";
import { getStatusIcon, getStatusColor } from "@/utils/statusHelpers";
import { LeaveRequest } from "../../../../types";

interface RequestItemProps {
  request: LeaveRequest;
}

export function RequestItem({ request }: RequestItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">
            {request.leaveType}
          </span>
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              request.status
            )}`}
          >
            {getStatusIcon(request.status)}
            {request.status}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          {new Date(request.startDate).toLocaleDateString()} -{" "}
          {new Date(request.endDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}