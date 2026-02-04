'use client';
import {UploadButtonProps}from "../../../../../types"


export default function UploadButton({ updating, onPhotoUpload }: UploadButtonProps) {
  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={onPhotoUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="facial-data-upload"
      />
      <button
        type="button"
        disabled={updating}
        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {updating ? 'Updating...' : 'Update Facial Data'}
      </button>
    </div>
  );
}