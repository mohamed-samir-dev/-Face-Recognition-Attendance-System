"use client";

import { Camera, Plus } from "lucide-react";

interface FileUploadAreaProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUploadArea({ onFileUpload }: FileUploadAreaProps) {
  return (
    <div className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 lg:p-8 text-center">
      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 relative">
        <Camera className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        <div className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <Plus className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
        </div>
      </div>
      <p className="text-blue-600 font-medium mb-2 text-sm lg:text-base">
        Click to upload or drag and drop
      </p>
      <p className="text-gray-500 text-xs lg:text-sm mb-4">
        PNG, JPG, or GIF (max. 5MB)
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={onFileUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}