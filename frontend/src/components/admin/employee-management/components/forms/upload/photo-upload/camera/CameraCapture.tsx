"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw, CheckCircle, Image as ImageIcon, Calendar, Clock } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [captureTime, setCaptureTime] = useState<Date | null>(null);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc && capturedImages.length < 3) {
      const newImages = [...capturedImages, imageSrc];
      setCapturedImages(newImages);
      if (!captureTime) setCaptureTime(new Date());
      
      // Send first image as profile photo and all 3 for encoding
      if (newImages.length === 3) {
        onCapture(JSON.stringify({
          profileImage: newImages[0], // First image for display
          trainingImages: newImages    // All 3 for face recognition
        }));
      }
    }
  };

  const retakeAll = () => {
    setCapturedImages([]);
    setCaptureTime(null);
  };

  const removeImage = (index: number) => {
    setCapturedImages(capturedImages.filter((_, i) => i !== index));
  };

  const allCaptured = capturedImages.length === 3;

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
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user"
              }}
              className="w-full"
            />
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg font-bold shadow-lg">
              Photo {capturedImages.length + 1} of 3
            </div>
            
            {/* Tip Box */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2.5 border border-white/20 shadow-lg">
              <p className="text-white text-sm font-medium">
                💡 {captureTips[capturedImages.length]}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={capturePhoto}
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <Camera className="w-5 h-5" />
            Capture Photo {capturedImages.length + 1}
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
