import { Upload } from "lucide-react";
import {UploadButtonProps}from "../types"


export default function UploadButton({ onClick }: UploadButtonProps) {
  return (
    <div className="text-center sm:text-left">
      <button
        onClick={onClick}
        className="bg-linear-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 cursor-pointer text-xs sm:text-sm lg:text-base mx-auto sm:mx-0"
      >
        <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
        <span>Change Picture</span>
      </button>
      <p className="text-black text-xs sm:text-sm">
        JPG, GIF or PNG. 5MB max.
      </p>
      <p className="text-black text-xs sm:text-sm mt-0.5 sm:mt-1">
        Recommended: 400x400 pixels
      </p>
    </div>
  );
}