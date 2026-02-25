"use client";

interface ImagePreviewProps {
  imageUrl: string;
}

export default function ImagePreview({ imageUrl }: ImagePreviewProps) {
  if (!imageUrl) return null;

  // Handle camera capture data with profile image
  try {
    const parsed = JSON.parse(imageUrl);
    if (parsed.profileImage && parsed.trainingImages) {
      return (
        <div className="mt-4">
          <img
            src={parsed.profileImage}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
          />
        </div>
      );
    }
  } catch {
    // Not JSON, treat as regular URL or base64
  }

  // Handle base64 or regular URL
  return (
    <div className="mt-4">
      <img
        src={imageUrl}
        alt="Preview"
        className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
      />
    </div>
  );
}