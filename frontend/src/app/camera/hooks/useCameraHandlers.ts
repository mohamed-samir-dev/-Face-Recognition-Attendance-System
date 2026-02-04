"use client";

import { useCallback, useState } from "react";
import { validateFaceInCircle } from "../utils/faceDetection";

interface UseCameraHandlersProps {
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => string | null;
  processAttendance: (imageData: string, callback: () => void) => Promise<void>;
  processCheckOut: (imageData: string, callback: () => void) => Promise<void>;
  resetState: () => void;
  setError: (error: string) => void;
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function useCameraHandlers({
  startCamera,
  stopCamera,
  captureImage,
  processAttendance,
  processCheckOut,
  resetState,
  setError,
  cameraActive,
  videoRef
}: UseCameraHandlersProps) {
  const handleStartCamera = useCallback(async () => {
    try {
      setError("");
      await startCamera();
    } catch (error) {
      setError((error as Error).message);
    }
  }, [startCamera, setError]);

  const handleCaptureAndDetect = useCallback(async () => {
    if (videoRef.current) {
      const validation = await validateFaceInCircle(videoRef.current);
      if (!validation.isValid) {
        setError(validation.message);
        return;
      }
    }
    
    const imageData = captureImage();
    if (!imageData) {
      setError("Camera not ready. Please start camera first.");
      return;
    }
    await processAttendance(imageData, stopCamera);
  }, [captureImage, processAttendance, stopCamera, setError, videoRef]);

  const handleCheckOut = useCallback(async () => {
    if (videoRef.current) {
      const validation = await validateFaceInCircle(videoRef.current);
      if (!validation.isValid) {
        setError(validation.message);
        return;
      }
    }
    
    const imageData = captureImage();
    if (!imageData) {
      setError("Camera not ready. Please start camera first.");
      return;
    }
    await processCheckOut(imageData, stopCamera);
  }, [captureImage, processCheckOut, stopCamera, setError, videoRef]);

  const handleRetry = useCallback(() => {
    resetState();
    if (cameraActive) {
      stopCamera();
    }
    handleStartCamera();
  }, [resetState, cameraActive, stopCamera, handleStartCamera]);

  return {
    handleStartCamera,
    handleCaptureAndDetect,
    handleCheckOut,
    handleRetry
  };
}