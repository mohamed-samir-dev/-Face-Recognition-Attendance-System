"use client";

interface CameraHeaderProps {
  mode?: string;
  title?: string;
  description?: string;
}

export default function CameraHeader({ 
  mode = "checkin",
  title,
  description
}: CameraHeaderProps) {
  const defaultTitle = mode === "checkout" 
    ? "Check-Out Authentication" 
    : "Taking Your Attendance";
  
  const defaultDescription = mode === "checkout"
    ? "Secure check-out process with face recognition and ID validation."
    : "Secure attendance marking with face recognition and ID validation.";

  return (
    <div className="text-center mb-3 sm:mb-4 md:mb-5 px-2">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1A1A1A] mb-1 sm:mb-1.5 md:mb-2">
        {title || defaultTitle}
      </h2>
      <p className="text-xs sm:text-sm md:text-base text-[#555] leading-relaxed">
        {description || defaultDescription}
      </p>
    </div>
  );
}