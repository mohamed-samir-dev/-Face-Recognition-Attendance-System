"use client";

import { useRef, useEffect, useState } from "react";

interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FaceDetectionOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  onFaceCountChange?: (count: number) => void;
}

export default function FaceDetectionOverlay({ videoRef, isActive, onFaceCountChange }: FaceDetectionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceCount, setFaceCount] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      detectFaces();
    }, 500);

    return () => clearInterval(interval);
  }, [isActive, isDetecting]);

  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current || isDetecting) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');

    setIsDetecting(true);
    try {
      const response = await fetch('http://localhost:5001/detect_faces_realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      });

      if (!response.ok) throw new Error('Detection failed');

      const data = await response.json();
      if (data.success) {
        setFaceCount(data.face_count);
        onFaceCountChange?.(data.face_count);
        drawFaceBoxes(data.faces || []);
      }
    } catch (error) {
      setFaceCount(0);
      onFaceCountChange?.(0);
    } finally {
      setIsDetecting(false);
    }
  };

  const drawFaceBoxes = (faces: FaceBox[]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerRect = video.getBoundingClientRect();
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    if (!videoWidth || !videoHeight) return;
    
    const videoAspect = videoWidth / videoHeight;
    const containerAspect = containerRect.width / containerRect.height;
    
    let displayWidth, displayHeight, offsetX, offsetY;
    
    if (containerAspect > videoAspect) {
      displayHeight = containerRect.height;
      displayWidth = displayHeight * videoAspect;
      offsetX = (containerRect.width - displayWidth) / 2;
      offsetY = 0;
    } else {
      displayWidth = containerRect.width;
      displayHeight = displayWidth / videoAspect;
      offsetX = 0;
      offsetY = (containerRect.height - displayHeight) / 2;
    }
    
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;
    
    const scaleX = displayWidth / videoWidth;
    const scaleY = displayHeight / videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach((face) => {
      const color = faces.length === 1 ? '#10b981' : '#ef4444';
      
      const x = (face.x * scaleX) + offsetX;
      const y = (face.y * scaleY) + offsetY;
      
      ctx.fillStyle = color;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.font = 'bold 18px Arial';
      ctx.fillText(faces.length === 1 ? '✓ Face Detected' : '❌ Multiple Faces', x, y - 10);
      ctx.shadowBlur = 0;
    });
  };

  if (!isActive) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      />
      
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border shadow-xl transition-all duration-300 ${
        faceCount === 0
          ? 'bg-amber-500/20 border-amber-400/40 shadow-amber-500/20'
          : faceCount === 1
          ? 'bg-emerald-500/20 border-emerald-400/40 shadow-emerald-500/20'
          : 'bg-red-500/20 border-red-400/40 shadow-red-500/20'
      }`}>
        <span className={`w-2 h-2 rounded-full animate-pulse ${
          faceCount === 0 ? 'bg-amber-400' : faceCount === 1 ? 'bg-emerald-400' : 'bg-red-400'
        }`} />
        <p className={`text-xs font-semibold tracking-wide uppercase ${
          faceCount === 0 ? 'text-amber-300' : faceCount === 1 ? 'text-emerald-300' : 'text-red-300'
        }`}>
          {faceCount === 0 && 'Position your face'}
          {faceCount === 1 && 'Face detected — Ready'}
          {faceCount > 1 && `${faceCount} faces — One person only`}
        </p>
      </div>
    </>
  );
}
