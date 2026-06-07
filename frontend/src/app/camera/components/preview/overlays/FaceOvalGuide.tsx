"use client";

interface FaceOvalGuideProps {
  isProcessing?: boolean;
}

export default function FaceOvalGuide({ isProcessing = false }: FaceOvalGuideProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
      {/* Vignette */}
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative w-44 h-56 sm:w-52 sm:h-64">

        {/* Scanning line animation */}
        {isProcessing && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80"
              style={{ animation: "scanLine 1.5s ease-in-out infinite" }}
            />
          </div>
        )}

        {/* Main oval */}
        <div
          className={`w-full h-full rounded-full border-2 transition-all duration-500 ${
            isProcessing
              ? "border-yellow-400"
              : "border-white/80"
          }`}
          style={{
            boxShadow: isProcessing
              ? "0 0 0 1px rgba(250,204,21,0.2), 0 0 25px rgba(250,204,21,0.35), inset 0 0 25px rgba(250,204,21,0.08)"
              : "0 0 0 1px rgba(255,255,255,0.08), 0 0 20px rgba(255,255,255,0.12), inset 0 0 20px rgba(255,255,255,0.04)",
          }}
        />

        {/* Corner brackets — top-left */}
        <div className={`absolute -top-[3px] -left-[3px] w-6 h-6 border-t-[3px] border-l-[3px] rounded-tl-xl transition-colors duration-300 ${isProcessing ? "border-yellow-400" : "border-white"}`} />
        {/* top-right */}
        <div className={`absolute -top-[3px] -right-[3px] w-6 h-6 border-t-[3px] border-r-[3px] rounded-tr-xl transition-colors duration-300 ${isProcessing ? "border-yellow-400" : "border-white"}`} />
        {/* bottom-left */}
        <div className={`absolute -bottom-[3px] -left-[3px] w-6 h-6 border-b-[3px] border-l-[3px] rounded-bl-xl transition-colors duration-300 ${isProcessing ? "border-yellow-400" : "border-white"}`} />
        {/* bottom-right */}
        <div className={`absolute -bottom-[3px] -right-[3px] w-6 h-6 border-b-[3px] border-r-[3px] rounded-br-xl transition-colors duration-300 ${isProcessing ? "border-yellow-400" : "border-white"}`} />

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isProcessing ? "bg-yellow-400 animate-ping" : "bg-white/40"}`} />
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 10%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
