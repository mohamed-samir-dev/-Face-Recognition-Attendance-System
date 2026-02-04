"use client";

import AttendanceAlreadyTakenModal from "../../../AttendanceAlreadyTakenModal";

interface CameraModalsProps {
  showAlreadyTakenModal: boolean;
  setShowAlreadyTakenModal: (show: boolean) => void;
}

export default function CameraModals({ 
  showAlreadyTakenModal, 
  setShowAlreadyTakenModal 
}: CameraModalsProps) {
  return (
    <AttendanceAlreadyTakenModal
      isOpen={showAlreadyTakenModal}
      onClose={() => setShowAlreadyTakenModal(false)}
    />
  );
}