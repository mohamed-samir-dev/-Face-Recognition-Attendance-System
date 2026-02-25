"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { User } from "@/lib/types";
import { getSupervisorLeaveRequests } from "@/lib/services/leave/supervisorLeaveService";
import { LeaveRequest } from "@/components/admin/attendance/types";
import DeleteConfirmModal from "@/components/common/modals/DeleteConfirmModal";

interface SupervisorLeavesProps {
  user: User;
}

export default function SupervisorLeaves({ user }: SupervisorLeavesProps) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All Request");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; request: LeaveRequest | null }>({ isOpen: false, request: null });

  const loadLeaveRequests = useCallback(async () => {
    try {
      const requests = await getSupervisorLeaveRequests(user.id);
      setLeaveRequests(requests);
    } catch (error) {
      console.error("Error loading leave requests:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadLeaveRequests();
  }, [loadLeaveRequests]);

  const handleStatusUpdate = async (
    requestId: string,
    status: "Approved" | "Rejected"
  ) => {
    try {
      const { updateLeaveRequestStatus } = await import(
        "@/lib/services/leave/leaveService"
      );
      await updateLeaveRequestStatus(requestId, status);
      await loadLeaveRequests();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      if (!deleteModal.request) return;

      const { deleteLeaveRequest } = await import(
        "@/lib/services/leave/leaveService"
      );
      const { createNotification } = await import(
        "@/lib/services/system/notificationService"
      );
      
      await deleteLeaveRequest(deleteModal.request.id);
      await createNotification(
        deleteModal.request.employeeId,
        `Your leave request from ${new Date(deleteModal.request.startDate).toLocaleDateString()} to ${new Date(deleteModal.request.endDate).toLocaleDateString()} has been canceled and removed from the system.`,
        'leave_canceled'
      );
      await loadLeaveRequests();
      setDeleteModal({ isOpen: false, request: null });
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const filteredRequests = leaveRequests.filter((req) => {
    if (statusFilter === "All Request") return true;
    return req.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
        <p className="text-gray-600 mt-1">
          Manage leave requests from your department
        </p>
      </div>

      <div className="mb-6 flex space-x-2">
        {["All Request", "Pending", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Leave Requests
            </h3>
            <p className="text-gray-500">No leave requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {request.employeeName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.leaveType}
                    </td>
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
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {request.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(request.id, "Approved")
                              }
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 transition-colors cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(request.id, "Rejected")
                              }
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        {request.status === "Approved" && (
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, request })}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, request: null })}
        onConfirm={handleDeleteRequest}
        employeeName={deleteModal.request?.employeeName || ""}
      />
    </div>
  );
}
