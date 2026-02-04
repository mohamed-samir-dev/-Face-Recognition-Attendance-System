import { useState } from "react";
import { updateLeaveRequestStatus, deleteLeaveRequest } from "@/lib/services/leave/leaveService";
import { createNotification } from "@/lib/services/system/notificationService";
import { LeaveRequest,ToastState } from "../../types"




export function useLeaveActions(refetch: () => void) {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const handleStatusUpdate = async (
    requestId: string,
    status: "Approved" | "Rejected",
    leaveRequests: LeaveRequest[]
  ) => {
    const request = leaveRequests.find((req) => req.id === requestId);
    try {
      await updateLeaveRequestStatus(requestId, status);

      if (request) {
        const notificationMessage =
          status === "Approved"
            ? `🎉 Great news! Your leave request from ${new Date(
                request.startDate
              ).toLocaleDateString()} to ${new Date(
                request.endDate
              ).toLocaleDateString()} has been approved.`
            : `❌ Your leave request from ${new Date(
                request.startDate
              ).toLocaleDateString()} to ${new Date(
                request.endDate
              ).toLocaleDateString()} has been rejected.`;

        await createNotification(
          request.employeeId,
          notificationMessage,
          status === "Approved" ? "leave_approved" : "leave_rejected"
        );
      }

      refetch();

      if (status === "Approved" && request) {
        window.dispatchEvent(
          new CustomEvent("leaveDaysUpdated", {
            detail: { employeeId: request.employeeId },
          })
        );
      }

      const adminMessage =
        status === "Approved"
          ? `✅ ${request?.employeeName}'s leave request has been approved successfully!`
          : `❌ ${request?.employeeName}'s leave request has been rejected.`;
      setToast({ message: adminMessage, type: "success", isVisible: true });
    } catch {
      setToast({
        message: "Failed to update request status",
        type: "error",
        isVisible: true,
      });
    }
  };

  const handleDeleteRequest = async (deleteRequest: LeaveRequest) => {
    try {
      await deleteLeaveRequest(deleteRequest.id);
      refetch();

      await createNotification(
        deleteRequest.employeeId,
        "Your leave request has been cancelled.",
        "leave_rejected"
      );

      if (deleteRequest.status === "Approved") {
        window.dispatchEvent(
          new CustomEvent("leaveDaysUpdated", {
            detail: { employeeId: deleteRequest.employeeId },
          })
        );
      }

      setToast({
        message: `✅ ${deleteRequest.employeeName}'s leave request has been deleted successfully!`,
        type: "success",
        isVisible: true,
      });
    } catch {
      setToast({
        message: "Failed to delete request",
        type: "error",
        isVisible: true,
      });
    }
  };

  return {
    toast,
    setToast,
    handleStatusUpdate,
    handleDeleteRequest,
  };
}