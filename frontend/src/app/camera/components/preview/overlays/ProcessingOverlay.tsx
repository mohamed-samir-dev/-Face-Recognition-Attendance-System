import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps {
  cameraActive: boolean;
}

export default function ProcessingOverlay({ cameraActive }: ProcessingOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="text-center text-white">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
        <p className="text-xs sm:text-sm font-medium">
          {cameraActive ? "Processing..." : "Starting Camera..."}
        </p>
      </div>
    </div>
  );
}