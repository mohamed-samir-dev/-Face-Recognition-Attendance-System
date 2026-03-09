"use client";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw, CheckCircle, Image as ImageIcon, Calendar, Clock, AlertTriangle } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [captureTime, setCaptureTime] = useState<Date | null>(null);
  const [faceBoxes, setFaceBoxes] = useState<FaceBox[]>([]);
  const [faceCount, setFaceCount] = useState<number>(0);
  const [canCapture, setCanCapture] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  const allCaptured = capturedImages.length === 3;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!allCaptured && !isDetecting) {
      interval = setInterval(() => {
        detectFaces();
      }, 500);
    }
    return () => clearInterval(interval);
  }, [capturedImages, isDetecting, allCaptured]);

  const detectFaces = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc || isDetecting) return;

    setIsDetecting(true);
    try {
      const response = await fetch('http://localhost:5001/detect_faces_realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc })
      });

      if (!response.ok) throw new Error('Detection failed');

      const data = await response.json();
      console.log('Detection result:', data);
      if (data.success) {
        setFaceBoxes(data.faces || []);
        setFaceCount(data.face_count);
        setCanCapture(data.can_capture);
        drawFaceBoxes(data.faces || []);
      }
    } catch (error) {
      setCanCapture(true);
      setFaceCount(0);
    } finally {
      setIsDetecting(false);
    }
  };

  const drawFaceBoxes = (faces: FaceBox[]) => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get container size
    const containerRect = video.getBoundingClientRect();
    
    // Get actual video stream dimensions
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    if (!videoWidth || !videoHeight) return;
    
    // Calculate the actual displayed video size (considering object-contain)
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
    
    // Set canvas to container size
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;
    
    // Calculate scale based on actual display size
    const scaleX = displayWidth / videoWidth;
    const scaleY = displayHeight / videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach((face) => {
      const color = faces.length === 1 ? '#10b981' : '#ef4444';
      
      // Scale and offset coordinates
      const x = (face.x * scaleX) + offsetX;
      const y = (face.y * scaleY) + offsetY;
      const width = face.width * scaleX;
      
      // Draw only text label without rectangle
      ctx.fillStyle = color;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.font = 'bold 18px Arial';
      ctx.fillText(faces.length === 1 ? '✓ Face Detected' : '❌ Multiple Faces', x, y - 10);
      ctx.shadowBlur = 0;
    });
  };

  const capturePhoto = () => {
    if (!canCapture) return;
    
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc && capturedImages.length < 3) {
      const newImages = [...capturedImages, imageSrc];
      setCapturedImages(newImages);
      if (!captureTime) setCaptureTime(new Date());
      
      if (newImages.length === 3) {
        onCapture(JSON.stringify({
          profileImage: newImages[0],
          trainingImages: newImages
        }));
      }
    }
  };

  const retakeAll = () => {
    setCapturedImages([]);
    setCaptureTime(null);
    setFaceBoxes([]);
    setFaceCount(0);
    setCanCapture(false);
    setIsDetecting(false);
  };

  const removeImage = (index: number) => {
    setCapturedImages(capturedImages.filter((_, i) => i !== index));
  };

  const captureTips = [
    "Look straight at the camera with good lighting",
    "Turn your head slightly to the right",
    "Turn your head slightly to the left"
  ];

  return (
    <div className="space-y-4">
      {!allCaptured && (
        <>
          <div className="relative rounded-xl overflow-hidden bg-linear-to-br from-gray-900 to-gray-800 shadow-2xl border-2 border-gray-700">
            <div className="relative aspect-video bg-black">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                mirrored={false}
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user"
                }}
                className="w-full h-full object-contain"
                onLoadedMetadata={() => {
                  setTimeout(() => detectFaces(), 500);
                }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
            </div>
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg font-bold shadow-lg">
              Photo {capturedImages.length + 1} of 3
            </div>
            
            {/* Face Detection Status */}
            <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md rounded-lg px-4 py-2 border shadow-lg ${
              faceCount === 0 ? 'bg-yellow-500/20 border-yellow-500/50' :
              faceCount === 1 ? 'bg-green-500/20 border-green-500/50' :
              'bg-red-500/20 border-red-500/50'
            }`}>
              <p className="text-white text-sm font-bold flex items-center gap-2">
                {faceCount === 0 && '⚠️ No face detected'}
                {faceCount === 1 && '✓ Face detected - Ready to capture'}
                {faceCount > 1 && `❌ ${faceCount} faces detected - Only 1 allowed`}
              </p>
            </div>
            
            {/* Tip Box */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2.5 border border-white/20 shadow-lg">
              <p className="text-white text-sm font-medium">
                💡 {captureTips[capturedImages.length]}
              </p>
            </div>
          </div>

          {faceCount > 1 && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-900 mb-1">Multiple Faces Detected</h4>
                <p className="text-sm text-red-700">
                  Please ensure only one person is visible in the camera frame. {faceCount} faces are currently detected.
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={capturePhoto}
            disabled={!canCapture}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all transform ${
              canCapture
                ? 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl hover:-translate-y-0.5 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Camera className="w-5 h-5" />
            {canCapture ? `Capture Photo ${capturedImages.length + 1}` : 'Position face to capture'}
          </button>
        </>
      )}

      {capturedImages.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className={`px-6 py-4 border-b-2 ${
            allCaptured 
              ? 'bg-linear-to-r from-green-50 to-emerald-50 border-green-200' 
              : 'bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {allCaptured ? (
                  <div className="bg-green-500 p-2 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {allCaptured ? 'Capture Complete' : 'Capture in Progress'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {allCaptured 
                      ? 'All photos captured successfully'
                      : `${3 - capturedImages.length} more photo${3 - capturedImages.length > 1 ? 's' : ''} needed`}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                allCaptured 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}>
                {capturedImages.length}/3
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-5">
            {/* Images Row */}
            <div className="flex justify-center gap-4">
              {capturedImages.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="relative rounded-xl overflow-hidden border-2 border-green-400 shadow-lg hover:shadow-xl transition-shadow">
                    <img src={img} alt={`Photo ${index + 1}`} className="w-32 h-32 object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm text-gray-800 px-2 py-0.5 rounded text-xs font-bold shadow-md">
                      Photo {index + 1}
                    </div>
                  </div>
                  {!allCaptured && (
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Info Section */}
            <div className="space-y-4">
                {/* Status Message */}
                <div className={`p-4 rounded-xl border-l-4 ${
                  allCaptured 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-blue-50 border-blue-500'
                }`}>
                  <p className="text-sm font-medium text-gray-700">
                    {allCaptured 
                      ? '✓ Face encoding will be generated when you submit the form'
                      : `⏳ Continue capturing to complete the facial recognition setup`}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <Calendar className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wide">Date</span>
                    </div>
                    <p className="text-base font-bold text-gray-800">
                      {captureTime?.toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-700 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wide">Time</span>
                    </div>
                    <p className="text-base font-bold text-gray-800">
                      {captureTime?.toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center gap-2 text-orange-700 mb-2">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wide">Photos</span>
                    </div>
                    <p className="text-base font-bold text-gray-800">{capturedImages.length}/3</p>
                  </div>

                  <div className={`bg-linear-to-br rounded-xl p-4 border ${
                    allCaptured 
                      ? 'from-green-50 to-green-100 border-green-200' 
                      : 'from-amber-50 to-amber-100 border-amber-200'
                  }`}>
                    <div className={`flex items-center gap-2 mb-2 ${
                      allCaptured ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wide">Status</span>
                    </div>
                    <p className={`text-base font-bold ${
                      allCaptured ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      {allCaptured ? '✓ Ready' : '⏳ In Progress'}
                    </p>
                  </div>
                </div>

                {/* Retake Button */}
                <button
                  type="button"
                  onClick={retakeAll}
                  className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake All Photos
                </button>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}
