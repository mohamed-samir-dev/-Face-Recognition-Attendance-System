import { RequestItem } from "./RequestItem";
import { LeaveRequest } from "../../../../types";

interface RequestsListProps {
  requests: LeaveRequest[];
}

export function RequestsList({ requests }: RequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-4 sm:py-6 text-gray-500 text-xs sm:text-sm">
        No absence requests found
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {requests.map((request) => (
        <RequestItem key={request.id} request={request} />
      ))}
    </div>
  );
}