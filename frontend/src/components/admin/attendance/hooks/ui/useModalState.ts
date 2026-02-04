import { useState } from "react";
import { LeaveRequest } from "../../types";

export function useModalState() {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteRequest, setDeleteRequest] = useState<LeaveRequest | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleDelete = (request: LeaveRequest) => {
    setDeleteRequest(request);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteRequest(null);
  };

  return {
    selectedRequest,
    isModalOpen,
    deleteRequest,
    isDeleteModalOpen,
    handleViewDetails,
    handleDelete,
    closeModal,
    closeDeleteModal,
  };
}