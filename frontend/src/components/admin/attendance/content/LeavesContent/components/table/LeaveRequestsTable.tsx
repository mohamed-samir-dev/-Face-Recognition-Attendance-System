import { LeaveRequestsTableProps } from "../../../../types";
import { useFilteredRequests } from "../../../../hooks/data/useFilteredRequests";
import { LeaveRequestRow, TableHeader, EmptyState, ErrorState } from "../";

export default function LeaveRequestsTable({
  leaveRequests,
  searchQuery,
  statusFilter,
  error,
  onViewDetails,
  onDelete,
}: LeaveRequestsTableProps) {
  const filteredRequests = useFilteredRequests(
    leaveRequests,
    searchQuery,
    statusFilter
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {error ? (
        <ErrorState error={error} />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <TableHeader />
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <LeaveRequestRow
                  key={request.id}
                  request={request}
                  onViewDetails={onViewDetails}
                  onDelete={onDelete}
                />
              ))}
              {filteredRequests.length === 0 && <EmptyState />}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
