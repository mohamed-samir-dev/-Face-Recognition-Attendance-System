import { Eye, Trash2 } from "lucide-react";
import { LeaveRequestRowProps } from "../../../../types";
import { getStatusColor } from "../../../shared";

export default function LeaveRequestRow({
  request,
  onViewDetails,
  onDelete,
}: LeaveRequestRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">
          {request.employeeName}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{request.leaveType}</td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">
          {new Date(request.startDate).toLocaleDateString()}
        </div>
        <div className="text-xs text-gray-500">
          to {new Date(request.endDate).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
            new Date(request.endDate) < new Date() &&
            request.status === "Approved"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : getStatusColor(request.status)
          }`}
        >
          {new Date(request.endDate) < new Date() &&
          request.status === "Approved"
            ? "Expired"
            : request.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(request)}
            className="group relative inline-flex items-center px-4 py-2 text-sm font-medium text-blue-500 cursor-pointer"
          >
            <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="relative">View Details</span>
          </button>
          <button
            onClick={() => onDelete(request)}
            className="group relative inline-flex items-center px-4 py-2 text-sm font-medium text-red-500 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="relative">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
