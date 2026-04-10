import { LeaveRequestsTableProps } from "../../../../types";
import { useFilteredRequests } from "../../../../hooks/data/useFilteredRequests";
import { LeaveRequestRow, TableHeader, EmptyState, ErrorState } from "../";
import { Eye, Trash2 } from "lucide-react";
import { getStatusColor } from "../../../shared";

function MobileCard({ request, onViewDetails, onDelete }: { request: Parameters<typeof LeaveRequestRow>[0]["request"]; onViewDetails: (r: typeof request) => void; onDelete: (r: typeof request) => void }) {
  const isExpired = new Date(request.endDate) < new Date() && request.status === "Approved";
  const statusLabel = isExpired ? "Expired" : request.status;
  const statusClass = isExpired
    ? "bg-purple-50 text-purple-700 border border-purple-200"
    : getStatusColor(request.status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900 text-base">{request.employeeName}</p>
          <p className="text-sm text-gray-500 mt-0.5">{request.leaveType}</p>
        </div>
        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${statusClass}`}>
          {statusLabel}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        <span>{new Date(request.startDate).toLocaleDateString()}</span>
        <span className="mx-2 text-gray-300">→</span>
        <span>{new Date(request.endDate).toLocaleDateString()}</span>
      </div>
      <div className="flex gap-2 pt-1 border-t border-gray-100">
        <button
          onClick={() => onViewDetails(request)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
        <button
          onClick={() => onDelete(request)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default function LeaveRequestsTable({
  leaveRequests,
  searchQuery,
  statusFilter,
  error,
  onViewDetails,
  onDelete,
}: LeaveRequestsTableProps) {
  const filteredRequests = useFilteredRequests(leaveRequests, searchQuery, statusFilter);

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <ErrorState error={error} />
      </div>
    );
  }

  return (
    <>
      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 px-6 py-16 text-center">
            <p className="text-gray-500 font-medium">No leave requests found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          filteredRequests.map(request => (
            <MobileCard key={request.id} request={request} onViewDetails={onViewDetails} onDelete={onDelete} />
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <TableHeader />
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <LeaveRequestRow key={request.id} request={request} onViewDetails={onViewDetails} onDelete={onDelete} />
              ))}
              {filteredRequests.length === 0 && <EmptyState />}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
