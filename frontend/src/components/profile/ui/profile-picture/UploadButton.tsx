import { Upload } from "lucide-react";
import {UploadButtonProps}from "../types"


export default function UploadButton({ onClick }: UploadButtonProps) {
  return (
    <div className="text-center sm:text-left">
      <button
        onClick={onClick}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2 mb-3 cursor-pointer text-sm sm:text-base"
      >
        <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>Change Picture</span>
      </button>
      <p className="text-black text-xs sm:text-sm">
        JPG, GIF or PNG. 5MB max.
      </p>
      <p className="text-black text-xs sm:text-sm mt-1">
        Recommended: 400x400 pixels
      </p>
    </div>
  );
}