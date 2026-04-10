"use client";

interface ImageOptionSelectorProps {
  imageOption: 'upload' | 'camera' | 'url';
  setImageOption: React.Dispatch<React.SetStateAction<'upload' | 'camera' | 'url'>>;
}

export default function ImageOptionSelector({
  imageOption,
  setImageOption,
}: ImageOptionSelectorProps) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <button
        type="button"
        onClick={() => setImageOption("upload")}
        className={`flex-1 min-w-[80px] px-3 py-2 text-sm rounded ${
          imageOption === "upload" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
        }`}
      >
        Upload
      </button>
      <button
        type="button"
        onClick={() => setImageOption("camera")}
        className={`flex-1 min-w-[80px] px-3 py-2 text-sm rounded ${
          imageOption === "camera" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
        }`}
      >
        Camera
      </button>
      <button
        type="button"
        onClick={() => setImageOption("url")}
        className={`flex-1 min-w-[80px] px-3 py-2 text-sm rounded ${
          imageOption === "url" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
        }`}
      >
        URL
      </button>
    </div>
  );
}