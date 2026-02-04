import ActionButton from "../actions/ActionButton";

interface StartCameraButtonProps {
  onStartCamera: () => void;
  isProcessing: boolean;
}

export default function StartCameraButton({ onStartCamera, isProcessing }: StartCameraButtonProps) {
  return (
    <ActionButton
      onClick={onStartCamera}
      disabled={isProcessing}
      loading={isProcessing}
    >
      {isProcessing ? "Starting Camera..." : "Start Camera"}
    </ActionButton>
  );
}