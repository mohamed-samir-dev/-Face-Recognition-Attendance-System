import { Users } from "lucide-react";

export default function MultipleFacesOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-orange-50/90">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Users className="w-8 h-8 text-orange-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-2">
          Multiple Faces Detected
        </h3>
        <p className="text-xs sm:text-sm text-[#555] px-4">
          Only one person is allowed. Please ensure you are alone in the frame.
        </p>
      </div>
    </div>
  );
}