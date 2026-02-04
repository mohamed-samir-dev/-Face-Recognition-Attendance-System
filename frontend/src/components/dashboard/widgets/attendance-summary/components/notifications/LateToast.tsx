import Toast from "@/components/common/feedback/Toast";

interface LateToastProps {
  isVisible: boolean;
  onClose: () => void;
}

export function LateToast({ isVisible, onClose }: LateToastProps) {
  return (
    <Toast
      message="Late Arrival Notice: Your tardiness has been recorded and may impact your salary and performance evaluation. Please ensure punctual attendance."
      type="warning"
      isVisible={isVisible}
      onClose={onClose}
      duration={8000}
    />
  );
}