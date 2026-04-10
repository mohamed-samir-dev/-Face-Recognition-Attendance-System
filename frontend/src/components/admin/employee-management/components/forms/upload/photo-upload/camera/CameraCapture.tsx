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

  const allCaptured = capturedImages.length === 3;

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: 1280,
      height: 720
    });
    
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
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border-2 border-gray-700">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                mirrored={false}
                videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/10 backdrop-blur-md text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-bold shadow-lg text-xs sm:text-sm">
              Photo {capturedImages.length + 1} of 3
            </div>
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/10 backdrop-blur-md rounded-lg px-2 py-1.5 sm:px-4 sm:py-2.5 border border-white/20 shadow-lg max-w-[45%] sm:max-w-xs">
              <p className="text-white text-xs sm:text-sm font-medium leading-tight">
                💡 {captureTips[capturedImages.length]}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={capturePhoto}
            className="w-full py-3 sm:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm sm:text-base cursor-pointer"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            Capture Photo {capturedImages.length + 1}
          </button>
        </>
      )}

      {capturedImages.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b-2 ${
            allCaptured ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${allCaptured ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {allCaptured ? <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" /> : <ImageIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-lg font-bold text-gray-800 truncate">
                    {allCaptured ? 'Capture Complete' : 'Capture in Progress'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {allCaptured ? 'All photos captured' : `${3 - capturedImages.length} more needed`}
                  </p>
                </div>
              </div>
              <div className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm flex-shrink-0 ${
                allCaptured ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {capturedImages.length}/3
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-6 space-y-4">
            {/* Images Row */}
            <div className="flex justify-center gap-2 sm:gap-4">
              {capturedImages.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="relative rounded-xl overflow-hidden border-2 border-green-400 shadow-lg">
                    <img src={img} alt={`Photo ${index + 1}`} className="w-24 h-24 sm:w-32 sm:h-32 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-1.5 right-1.5 bg-green-500 text-white p-0.5 sm:p-1 rounded-full shadow-lg">
                      <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 bg-white/95 text-gray-800 px-1.5 py-0.5 rounded text-xs font-bold shadow-md">
                      #{index + 1}
                    </div>
                  </div>
                  {!allCaptured && (
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Status Message */}
            <div className={`p-3 sm:p-4 rounded-xl border-l-4 ${
              allCaptured ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'
            }`}>
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                {allCaptured
                  ? '✓ Face encoding will be generated when you submit the form'
                  : '⏳ Continue capturing to complete the facial recognition setup'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4 border border-blue-200">
                <div className="flex items-center gap-1.5 text-blue-700 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Date</span>
                </div>
                <p className="text-xs sm:text-base font-bold text-gray-800">{captureTime?.toLocaleDateString()}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 sm:p-4 border border-purple-200">
                <div className="flex items-center gap-1.5 text-purple-700 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Time</span>
                </div>
                <p className="text-xs sm:text-base font-bold text-gray-800">{captureTime?.toLocaleTimeString()}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 sm:p-4 border border-orange-200">
                <div className="flex items-center gap-1.5 text-orange-700 mb-1">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Photos</span>
                </div>
                <p className="text-xs sm:text-base font-bold text-gray-800">{capturedImages.length}/3</p>
              </div>
              <div className={`bg-gradient-to-br rounded-xl p-3 sm:p-4 border ${
                allCaptured ? 'from-green-50 to-green-100 border-green-200' : 'from-amber-50 to-amber-100 border-amber-200'
              }`}>
                <div className={`flex items-center gap-1.5 mb-1 ${allCaptured ? 'text-green-700' : 'text-amber-700'}`}>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Status</span>
                </div>
                <p className={`text-xs sm:text-base font-bold ${allCaptured ? 'text-green-700' : 'text-amber-700'}`}>
                  {allCaptured ? '✓ Ready' : '⏳ In Progress'}
                </p>
              </div>
            </div>

            {/* Retake Button */}
            <button
              type="button"
              onClick={retakeAll}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2.5 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              Retake All Photos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
