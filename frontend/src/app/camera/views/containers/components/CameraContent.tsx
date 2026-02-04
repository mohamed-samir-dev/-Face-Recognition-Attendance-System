"use client";

import { forwardRef } from "react";
import {
  CameraHeader,
  CameraSection,
  AuthenticationStatus,
  EmployeeSection,
  ControlsSection
} from "../../components";
import {CameraContentProps}from "../../../types"


const CameraContent = forwardRef<HTMLVideoElement | null, CameraContentProps & { 
  verificationStep?: 'face' | 'id' | 'complete' | '';
  faceStatus?: 'pending' | 'success' | 'failed';
  idStatus?: 'pending' | 'success' | 'failed';
  recognizedName?: string;
  verifiedId?: string;
  showUnauthorizedWarning?: boolean;
  recognizedImage?: string;
  detectedUser?: any;
  expectedUser?: any;
}>(
  (props, videoRef) => {
    const {
      cameraActive,
      isProcessing,
      attendanceMarked,
      recognizedUser,
      recognizedEmployee,
      error,
      attemptsRemaining,
      exhaustedAttempts,
      multipleFaces,
      detecting,
      mode,
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
      onStartCamera,
      onCaptureAndDetect,
      onCheckOut,
      onRetry
    } = props;

    return (
      <>
        <CameraHeader mode={mode} />
        
        <CameraSection
          ref={videoRef}
          cameraActive={cameraActive}
          isProcessing={isProcessing}
          attendanceMarked={attendanceMarked}
          recognizedUser={recognizedUser}
          error={error}
          exhaustedAttempts={exhaustedAttempts}
          attemptsRemaining={attemptsRemaining}
          multipleFaces={multipleFaces}
          checkedOut={checkedOut}
          checkOutData={checkOutData}
          verificationStep={verificationStep}
          faceStatus={faceStatus}
          idStatus={idStatus}
          recognizedName={recognizedName}
          verifiedId={verifiedId}
          showUnauthorizedWarning={showUnauthorizedWarning}
          recognizedImage={recognizedImage}
          detectedUser={detectedUser}
          expectedUser={expectedUser}
        />
        
        <AuthenticationStatus recognizedEmployee={recognizedEmployee} />
        
        <EmployeeSection 
          attendanceMarked={attendanceMarked}
          recognizedEmployee={recognizedEmployee}
        />

        <ControlsSection
          cameraActive={cameraActive}
          attendanceMarked={attendanceMarked}
          isProcessing={isProcessing}
          detecting={detecting}
          error={error}
          exhaustedAttempts={exhaustedAttempts}
          attemptsRemaining={attemptsRemaining}
          multipleFaces={multipleFaces}
          mode={mode}
          onStartCamera={onStartCamera}
          onCaptureAndDetect={onCaptureAndDetect}
          onCheckOut={onCheckOut}
          onRetry={onRetry}
        />
      </>
    );
  }
);

CameraContent.displayName = "CameraContent";

export default CameraContent;