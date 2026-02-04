import { ScanFace } from "lucide-react";

export default function StatusOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ScanFace className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-2">
          Camera Ready
        </h3>
        <p className="text-xs sm:text-sm text-[#555]">
          Click Start Camera to begin.
        </p>
      </div>
    </div>
  );
}