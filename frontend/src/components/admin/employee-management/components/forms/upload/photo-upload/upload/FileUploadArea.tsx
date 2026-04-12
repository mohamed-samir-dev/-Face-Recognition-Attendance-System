"use client";

import { useState } from "react";
import { Upload, X, CheckCircle } from "lucide-react";

interface FileUploadAreaProps {
  onCapture: (imageData: string) => void;
}

export default function FileUploadArea({ onCapture }: FileUploadAreaProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const max = 400;
        let { width, height } = img;
        if (width > height) { if (width > max) { height = (height * max) / width; width = max; } }
        else { if (height > max) { width = (width * max) / height; height = max; } }
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = URL.createObjectURL(file);
    });

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - uploadedImages.length;
    const compressed = await Promise.all(files.slice(0, remaining).map(compressImage));
    const newImages = [...uploadedImages, ...compressed];
    setUploadedImages(newImages);
    if (newImages.length === 3) {
      onCapture(JSON.stringify({ profileImage: newImages[0], trainingImages: newImages }));
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const allUploaded = uploadedImages.length === 3;

  return (
    <div className="space-y-4">
      {!allUploaded && (
        <div className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 lg:p-8 text-center hover:border-blue-400 transition-colors">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <p className="text-blue-600 font-medium mb-1 text-sm lg:text-base">Click to upload photos</p>
          <p className="text-gray-500 text-xs lg:text-sm mb-1">PNG, JPG (max. 5MB each)</p>
          <p className="text-orange-600 text-xs font-medium">
            {uploadedImages.length}/3 photos — {3 - uploadedImages.length} more needed
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-xl overflow-hidden">
          <div className={`px-4 py-3 border-b-2 ${
            allUploaded ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${allUploaded ? "bg-green-500" : "bg-blue-500"}`}>
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{allUploaded ? "Upload Complete" : "Upload in Progress"}</h3>
                  <p className="text-xs text-gray-600">{allUploaded ? "All 3 photos uploaded" : `${3 - uploadedImages.length} more needed`}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full font-bold text-xs ${allUploaded ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}>
                {uploadedImages.length}/3
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex justify-center gap-3">
              {uploadedImages.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="relative rounded-xl overflow-hidden border-2 border-green-400 shadow-lg">
                    <img src={img} alt={`Photo ${index + 1}`} className="w-24 h-24 sm:w-32 sm:h-32 object-cover" />
                    <div className="absolute bottom-1 left-1 bg-white/95 text-gray-800 px-1.5 py-0.5 rounded text-xs font-bold">#{index + 1}</div>
                  </div>
                  {!allUploaded && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className={`p-3 rounded-xl border-l-4 ${
              allUploaded ? "bg-green-50 border-green-500" : "bg-blue-50 border-blue-500"
            }`}>
              <p className="text-xs font-medium text-gray-700">
                {allUploaded
                  ? "✓ Face encoding will be generated when you submit the form"
                  : "⏳ Upload more photos to complete facial recognition setup"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setUploadedImages([])}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
            >
              <X className="w-4 h-4" />
              Remove All & Re-upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
