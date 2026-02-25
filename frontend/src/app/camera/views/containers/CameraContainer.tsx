"use client";

import { useCamera } from "../../hooks/useCamera";
import { useAttendance } from "../../hooks/useAttendance";
import { useCameraHandlers } from "../../hooks/useCameraHandlers";
import { CameraLayout, CameraContent, CameraModals } from "./components";

export default function CameraContainer({ mode }: { mode: string }) {
  const { cameraActive, isProcessing, videoRef, canvasRef, startCamera, stopCamera, captureImage } = useCamera();
  const { 
    attendanceMarked, 
    recognizedUser,
    error, 
    attemptsRemaining, 
    exhaustedAttempts, 
    multipleFaces, 
    detecting,
    showAlreadyTakenModal,
    checkedOut,
    checkOutData,
    verificationStep,
    faceStatus,
    idStatus,
    recognizedName,
    verifiedId,
    showUnauthorizedWarning,
    recognizedImage,
    detectedUser,
    expectedUser,
    setShowAlreadyTakenModal,
    processAttendance,
    processCheckOut, 
    resetState, 
    setError 
  } = useAttendance();

  const { handleStartCamera, handleCaptureAndDetect, handleCheckOut, handleRetry } = useCameraHandlers({
    startCamera,
    stopCamera,
    captureImage,
    processAttendance,
    processCheckOut,
    resetState,
    setError,
    cameraActive,
    videoRef
  });

  return (
    <CameraLayout>
      <CameraContent
        ref={videoRef}
        cameraActive={cameraActive}
        isProcessing={isProcessing}
        attendanceMarked={attendanceMarked}
        recognizedUser={recognizedUser}
        recognizedEmployee={recognizedUser}
        error={error}
        attemptsRemaining={attemptsRemaining}
        exhaustedAttempts={exhaustedAttempts}
        multipleFaces={multipleFaces}
        detecting={detecting}
        mode={mode}
        checkedOut={checkedOut}
        checkOutData={checkOutData as { name: string; checkIn: string; checkOut: string; workedHours: number; } | null}
        verificationStep={verificationStep}
        faceStatus={faceStatus}
        idStatus={idStatus}
        recognizedName={recognizedName}
        verifiedId={verifiedId}
        showUnauthorizedWarning={showUnauthorizedWarning}
        recognizedImage={recognizedImage}
        expectedUser={expectedUser as unknown as Record<string, unknown> | undefined}
        detectedUser={detectedUser || undefined}
        onStartCamera={handleStartCamera}
        onCaptureAndDetect={handleCaptureAndDetect}
        onCheckOut={handleCheckOut}
        onRetry={handleRetry}
      />
      
      <canvas ref={canvasRef} className="hidden" />
      
      <CameraModals
        showAlreadyTakenModal={showAlreadyTakenModal}
        setShowAlreadyTakenModal={setShowAlreadyTakenModal}
      />
    </CameraLayout>
  );
}