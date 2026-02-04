"use client";

import { forwardRef } from "react";
import CameraPreview from "../../../components/CameraPreview";
import {CameraSectionProps}from "../../../types"

const CameraSection = forwardRef<HTMLVideoElement, CameraSectionProps & { 
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
    return (
      <div className="mb-4 sm:mb-6">
        <CameraPreview ref={videoRef} {...props} />
      </div>
    );
  }
);

CameraSection.displayName = "CameraSection";

export default CameraSection;