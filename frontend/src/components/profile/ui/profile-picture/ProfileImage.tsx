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
    <div className="relative shrink-0">
      <Image
        src={selectedImage || userImage}
        alt={userName}
        width={120}
        height={120}
        className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-white shadow-lg"
        unoptimized
      />
      <button
        onClick={onCameraClick}
        className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 bg-white text-blue-600 p-1.5 sm:p-2 rounded-full hover:bg-gray-50 transition-colors shadow-md"
      >
        <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
      </button>
    </div>
  );
}