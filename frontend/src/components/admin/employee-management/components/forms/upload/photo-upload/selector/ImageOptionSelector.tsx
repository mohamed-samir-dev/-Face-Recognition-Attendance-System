"use client";

interface ImageOptionSelectorProps {
  imageOption: string;
  setImageOption: React.Dispatch<React.SetStateAction<string>>;
}

export default function ImageOptionSelector({
  imageOption,
  setImageOption,
}: ImageOptionSelectorProps) {
  return (
    <div className="flex space-x-2 mb-4">
      <button
        type="button"
        onClick={() => setImageOption("upload")}
        className={`px-3 py-2 text-sm rounded ${
          imageOption === "upload"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        Upload
      </button>
      <button
        type="button"
        onClick={() => setImageOption("camera")}
        className={`px-3 py-2 text-sm rounded ${
          imageOption === "camera"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        Camera
      </button>
      <button
        type="button"
        onClick={() => setImageOption("url")}
        className={`px-3 py-2 text-sm rounded ${
          imageOption === "url"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        URL
      </button>
    </div>
  );
}