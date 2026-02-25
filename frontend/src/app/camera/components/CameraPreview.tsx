"use client";

import { forwardRef } from "react";
import { CameraPreviewProps } from "../types";
import VideoElement from "./preview/video/VideoElement";
import StatusOverlay from "./preview/overlays/StatusOverlay";
import ErrorOverlay from "./preview/overlays/ErrorOverlay";
import MultipleFacesOverlay from "./preview/overlays/MultipleFacesOverlay";
import ExhaustedAttemptsOverlay from "./preview/overlays/ExhaustedAttemptsOverlay";
import ProcessingOverlay from "./preview/overlays/ProcessingOverlay";
import SuccessOverlay from "./preview/overlays/SuccessOverlay";
import CheckOutSuccessOverlay from "./preview/overlays/CheckOutSuccessOverlay";
import VerificationStepsOverlay from "./preview/overlays/VerificationStepsOverlay";

const CameraPreview = forwardRef<HTMLVideoElement, CameraPreviewProps & { 
  verificationStep?: 'face' | 'id' | 'complete' | '';
  faceStatus?: 'pending' | 'success' | 'failed';
  idStatus?: 'pending' | 'success' | 'failed';
  recognizedName?: string;
  verifiedId?: string;
  showUnauthorizedWarning?: boolean;
  recognizedImage?: string;
  detectedUser?: Record<string, unknown>;
  expectedUser?: Record<string, unknown>;
}>(
  (
    {
      cameraActive,
      isProcessing,
      attendanceMarked,
      recognizedUser,
      error,
      exhaustedAttempts,
      multipleFaces,
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
    },
    ref
  ) => {
    return (
      <div className="bg-gray-100 rounded-xl h-[450px] sm:h-[520px] lg:h-[450px] relative overflow-hidden">
        <VideoElement ref={ref} cameraActive={cameraActive} />

        {!cameraActive && !attendanceMarked && !isProcessing && !error && (
          <StatusOverlay />
        )}

        {error && !exhaustedAttempts && !multipleFaces && (
          <ErrorOverlay 
            showUnauthorizedWarning={showUnauthorizedWarning}
            recognizedName={recognizedName}
            recognizedImage={recognizedImage}
            recognizedUser={detectedUser}
            expectedUser={expectedUser}
          />
        )}

        {multipleFaces && (
          <MultipleFacesOverlay />
        )}

        {exhaustedAttempts && (
          <ExhaustedAttemptsOverlay />
        )}

        {verificationStep && (
          <VerificationStepsOverlay
            step={verificationStep}
            faceStatus={faceStatus}
            idStatus={idStatus}
            recognizedName={recognizedName}
            verifiedId={verifiedId}
          />
        )}

        {isProcessing && !attendanceMarked && !verificationStep && (
          <ProcessingOverlay cameraActive={cameraActive} />
        )}

        {attendanceMarked && recognizedUser && !checkedOut && (
          <SuccessOverlay 
            recognizedUser={{
              name: recognizedUser.name,
              username: recognizedUser.username,
              numericId: recognizedUser.numericId?.toString() || '',
              department: recognizedUser.department || recognizedUser.Department,
              jobTitle: recognizedUser.jobTitle,
              image: recognizedUser.image
            }} 
          />
        )}
        
        {checkedOut && checkOutData && (
          <CheckOutSuccessOverlay checkOutData={checkOutData} />
        )}
      </div>
    );
  }
);

CameraPreview.displayName = "CameraPreview";

export default CameraPreview;