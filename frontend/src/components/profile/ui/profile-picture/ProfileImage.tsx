import { Camera } from "lucide-react";
import Image from "next/image";
import {ProfileImageProps}from"../types"

export default function ProfileImage({
  selectedImage,
  userImage,
  userName,
  onCameraClick,
}: ProfileImageProps) {
  return (
    <div className="relative flex-shrink-0">
      <Image
        src={selectedImage || userImage}
        alt={userName}
        width={120}
        height={120}
        className="w-24 h-24 sm:w-28 sm:h-28 lg:w-30 lg:h-30 rounded-full object-cover border-4 border-white shadow-lg"
        unoptimized
      />
      <button
        onClick={onCameraClick}
        className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-white text-blue-600 p-1.5 sm:p-2 rounded-full hover:bg-gray-50 transition-colors shadow-md"
      >
        <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}