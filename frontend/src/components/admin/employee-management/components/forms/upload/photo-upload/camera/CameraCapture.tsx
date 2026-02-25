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
  const [capturedImage, setCapturedImage] = useState<string>("");

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
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
    } catch {
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
    setCapturedImage(imageData);
    onCapture(imageData);
    stopCamera();
    setCaptured(true);
  };

  const retakePhoto = () => {
    setCaptured(false);
    setCapturedImage("");
    startCamera();
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700 max-h-[450px]">
        {!captured ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto rounded-xl"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm px-6 py-2 rounded-full">
                <p className="text-white text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Live Camera
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="relative">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-auto rounded-xl"
            />
            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Captured!</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Camera className="w-5 h-5" />
              Capture Photo
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-5 py-3.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={retakePhoto}
            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3.5 rounded-xl hover:from-orange-700 hover:to-orange-800 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Photo
          </button>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-gray-700 text-center font-medium">
          {!captured
            ? "📸 Position your face in the circle and click capture"
            : "✨ Photo captured successfully! Click retake if you want to capture again"}
        </p>
      </div>
    </div>
  );
}
