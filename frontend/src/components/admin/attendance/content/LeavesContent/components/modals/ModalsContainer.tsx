import Modal from "@/components/common/modals/Modal";
import DeleteConfirmModal from "@/components/common/modals/DeleteConfirmModal";
import {ModalsContainerProps}from "../../../../types"

export default function ModalsContainer({
  isModalOpen,
  selectedRequest,
  isDeleteModalOpen,
  deleteRequest,
  onCloseModal,
  onCloseDeleteModal,
  onStatusUpdate,
  onConfirmDelete,
}: ModalsContainerProps) {
  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        request={selectedRequest}
        onStatusUpdate={onStatusUpdate}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        onConfirm={onConfirmDelete}
        employeeName={deleteRequest?.employeeName || ""}
      />
    </>
  );
}