import ActionButton from "../actions/ActionButton";

interface CaptureButtonProps {
  onCaptureAndDetect: () => void;
  isProcessing: boolean;
}

export default function CaptureButton({ onCaptureAndDetect, isProcessing }: CaptureButtonProps) {
  return (
    <ActionButton
      onClick={onCaptureAndDetect}
      disabled={isProcessing}
      loading={isProcessing}
    >
      {isProcessing ? "Processing..." : "Capture & Detect Face"}
    </ActionButton>
  );
}