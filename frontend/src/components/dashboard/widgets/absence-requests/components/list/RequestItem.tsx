import { Clock } from "lucide-react";
import { getStatusIcon, getStatusColor } from "@/utils/statusHelpers";
import { LeaveRequest } from "../../../../types";

interface RequestItemProps {
  request: LeaveRequest;
}

export function RequestItem({ request }: RequestItemProps) {
  return (
    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
            {request.leaveType}
          </span>
          <div
            className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              request.status
            )}`}
          >
            {getStatusIcon(request.status)}
            <span className="hidden xs:inline">{request.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {new Date(request.startDate).toLocaleDateString()} -{" "}
            {new Date(request.endDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}