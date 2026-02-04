import { CameraControlsProps } from "../types";
import StartCameraButton from "./controls/buttons/StartCameraButton";
import CaptureButton from "./controls/buttons/CaptureButton";
import CheckOutButton from "./controls/buttons/CheckOutButton";
import RetryButton from "./controls/buttons/RetryButton";
import AttemptsCounter from "./controls/feedback/AttemptsCounter";

export default function CameraControls({
  cameraActive,
  attendanceMarked,
  isProcessing,
  error,
  exhaustedAttempts,
  attemptsRemaining,
  multipleFaces,
  mode,
  onStartCamera,
  onCaptureAndDetect,
  onCheckOut,
  onRetry
}: CameraControlsProps) {
  return (
    <div className="space-y-3">
      {!cameraActive && !attendanceMarked && (
        <StartCameraButton
          onStartCamera={onStartCamera}
          isProcessing={isProcessing}
        />
      )}
      
      {cameraActive && !attendanceMarked && (
        <>
          {mode === 'checkout' ? (
            <CheckOutButton
              onCheckOut={onCheckOut}
              isProcessing={isProcessing}
            />
          ) : (
            <CaptureButton
              onCaptureAndDetect={onCaptureAndDetect}
              isProcessing={isProcessing}
            />
          )}
        </>
      )}
      
      {(error || multipleFaces) && !exhaustedAttempts && (
        <RetryButton onRetry={onRetry} />
      )}

      {error && !exhaustedAttempts && !multipleFaces && (
        <AttemptsCounter attemptsRemaining={attemptsRemaining} />
      )}
    </div>
  );
}