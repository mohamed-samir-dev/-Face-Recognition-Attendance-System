"use client";

import {
  PhotoUploadHeader,
  ImagePreview,
  ErrorMessage,
} from "./photo-upload";
import CameraCapture from "./photo-upload/camera/CameraCapture";
import {PhotoUploadSectionProps} from "../../../types"

export default function PhotoUploadSection({
  formData,
  setFormData,
  photoError,
}: PhotoUploadSectionProps) {
  const handleCapture = (imageData: string) => {
    setFormData({ ...formData, image: imageData });
  };

  return (
    <div>
      <PhotoUploadHeader />
      <CameraCapture onCapture={handleCapture} />
      <ImagePreview imageUrl={formData.image} />
      <ErrorMessage error={photoError} />
    </div>
  );
}
