"use client";

import NextImage from "next/image";

interface ImagePreviewProps {
  imageUrl: string;
}

export default function ImagePreview({ imageUrl }: ImagePreviewProps) {
  if (!imageUrl) return null;

  return (
    <div className="mt-4">
      <NextImage
        src={imageUrl}
        alt="Preview"
        width={80}
        height={80}
        className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
      />
    </div>
  );
}