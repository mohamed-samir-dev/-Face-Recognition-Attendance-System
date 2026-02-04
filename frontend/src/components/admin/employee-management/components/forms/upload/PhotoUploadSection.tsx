"use client";

import {
  PhotoUploadHeader,
  ImageOptionSelector,
  FileUploadArea,
  URLInput,
  ImagePreview,
  ErrorMessage,
} from "./photo-upload";
import CameraCapture from "./photo-upload/camera/CameraCapture";
import {PhotoUploadSectionProps} from "../../../types"

export default function PhotoUploadSection({
  formData,
  setFormData,
  imageOption,
  setImageOption,
  photoError,
  onFileUpload,
}: PhotoUploadSectionProps) {
  const handleCameraCapture = (imageData: string) => {
    setFormData({ ...formData, image: imageData });
  };

  return (
    <div>
      <PhotoUploadHeader />
      <ImageOptionSelector
        imageOption={imageOption}
        setImageOption={setImageOption}
      />
      {imageOption === "upload" && <FileUploadArea onFileUpload={onFileUpload} />}
      {imageOption === "camera" && <CameraCapture onCapture={handleCameraCapture} />}
      {imageOption === "url" && (
        <URLInput formData={formData} setFormData={setFormData} />
      )}
      <ImagePreview imageUrl={formData.image} />
      <ErrorMessage error={photoError} />
    </div>
  );
}
