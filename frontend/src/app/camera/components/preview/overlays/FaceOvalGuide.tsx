"use client";

interface FaceOvalGuideProps {
  isProcessing?: boolean;
}

export default function FaceOvalGuide({ isProcessing = false }: FaceOvalGuideProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
      {/* Subtle dark vignette */}
      <div className="absolute inset-0 bg-black/15" />
      {/* Oval + corner markers */}
      <div className="relative w-44 h-56 sm:w-48 sm:h-60">
        <div
          className={`w-full h-full rounded-full border-[3px] transition-colors duration-300 ${
            isProcessing
              ? "border-yellow-400 animate-pulse"
              : "border-white/70"
          }`}
          style={{
            boxShadow: isProcessing
              ? "0 0 20px rgba(250, 204, 21, 0.3), inset 0 0 20px rgba(250, 204, 21, 0.1)"
              : "0 0 30px rgba(255,255,255,0.1), inset 0 0 30px rgba(255,255,255,0.05)",
          }}
        />
        {/* Corner markers */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-[3px] border-l-[3px] border-white rounded-tl-lg" />
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-[3px] border-r-[3px] border-white rounded-tr-lg" />
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-[3px] border-l-[3px] border-white rounded-bl-lg" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-[3px] border-r-[3px] border-white rounded-br-lg" />
      </div>
    </div>
  );
}
