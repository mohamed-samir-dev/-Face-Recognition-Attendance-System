import { useState } from "react";
import { useLeaveRequests } from "@/components/admin/attendance/hooks/data/useLeaveRequests";
import Toast from "@/components/common/feedback/Toast";
import { LeavesContentProps } from "../../types";
import { useLeaveActions } from "../../hooks/actions/useLeaveActions";
import { useModalState } from "../../hooks/ui/useModalState";
import {
  StatusTabs,
  LeaveRequestsTable,
  LoadingSpinner,
  LeavesHeader,
  ModalsContainer,
} from "./components";

export default function LeavesContent({ searchQuery }: LeavesContentProps) {
  const { leaveRequests, loading, error, refetch } = useLeaveRequests();
  const [statusFilter, setStatusFilter] = useState("All Request");

  const { toast, setToast, handleStatusUpdate, handleDeleteRequest } =
    useLeaveActions(refetch);
  const {
    selectedRequest,
    isModalOpen,
    deleteRequest,
    isDeleteModalOpen,
    handleViewDetails,
    handleDelete,
    closeModal,
    closeDeleteModal,
  } = useModalState();

  const onStatusUpdate = (
    requestId: string,
    status: "Approved" | "Rejected"
  ) => {
    handleStatusUpdate(requestId, status, leaveRequests);
  };

  const onConfirmDelete = async () => {
    if (deleteRequest) {
      await handleDeleteRequest(deleteRequest);
      closeDeleteModal();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="p-6">
        <LeavesHeader />

        <StatusTabs
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          leaveRequests={leaveRequests}
        />

        <LeaveRequestsTable
          leaveRequests={leaveRequests}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          error={error}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
        />
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <ModalsContainer
        isModalOpen={isModalOpen}
        selectedRequest={selectedRequest}
        isDeleteModalOpen={isDeleteModalOpen}
        deleteRequest={deleteRequest}
        onCloseModal={closeModal}
        onCloseDeleteModal={closeDeleteModal}
        onStatusUpdate={onStatusUpdate}
        onConfirmDelete={onConfirmDelete}
      />
    </>
  );
}
