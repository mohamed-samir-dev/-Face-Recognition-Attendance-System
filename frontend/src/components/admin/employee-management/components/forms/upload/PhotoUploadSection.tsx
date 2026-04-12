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
  const handleCapture = (imageData: string) => {
    setFormData({ ...formData, image: imageData });
  };

  return (
    <div>
      <PhotoUploadHeader />
      <ImageOptionSelector
        imageOption={imageOption}
        setImageOption={setImageOption}
      />
      {imageOption === "upload" && <FileUploadArea onCapture={handleCapture} />}
      {imageOption === "camera" && <CameraCapture onCapture={handleCapture} />}
      {imageOption === "url" && (
        <URLInput formData={formData} setFormData={setFormData} />
      )}
      <ImagePreview imageUrl={formData.image} />
      <ErrorMessage error={photoError} />
    </div>
  );
}
