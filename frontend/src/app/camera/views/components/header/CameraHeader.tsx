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
    <div className="text-center mb-4">
      <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2">
        {title || defaultTitle}
      </h2>
      <p className="text-sm sm:text-base text-[#555]">
        {description || defaultDescription}
      </p>
    </div>
  );
}