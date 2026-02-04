"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, X, RotateCcw, CheckCircle } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [captured, setCaptured] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError("");
      setCaptured(false);
      setShowSuccess(false);
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    onCapture(imageData);
    stopCamera();
    setCaptured(true);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const retakePhoto = () => {
    setCaptured(false);
    setShowSuccess(false);
    startCamera();
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="relative bg-black rounded-lg overflow-hidden">
        {!captured ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-white/50 rounded-full"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="relative">
            <div className="w-full h-96 bg-gray-900 flex items-center justify-center">
              <div className="text-center space-y-4">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                <p className="text-white text-xl font-semibold">Photo Captured Successfully!</p>
                <p className="text-gray-300 text-sm">Preview shown below</p>
              </div>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-3">
        {!captured ? (
          <>
            <button
              type="button"
              onClick={capturePhoto}
              disabled={!stream}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2 font-medium"
            >
              <Camera className="w-5 h-5" />
              Capture Photo
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={retakePhoto}
            className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2 font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Photo
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 text-center">
        {!captured
          ? "Position your face in the circle and click capture"
          : "Click retake to capture a new photo"}
      </p>
    </div>
  );
}
