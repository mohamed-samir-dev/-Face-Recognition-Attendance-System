"use client";

import { Camera, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, User, Hash, Building2, Briefcase } from "lucide-react";
import Card from "@/components/common/cards/Card";
import FaceOvalGuide from "@/app/camera/components/preview/overlays/FaceOvalGuide";
import { useFaceLogin, RecognizedUserData } from "../hooks/useFaceLogin";

import SessionBlockedModal from "../components/SessionBlockedModal";

interface FaceLoginCameraProps {
  onCancel: () => void;
}

function SuccessScreen({ user }: { user: RecognizedUserData }) {
  return (
    <div className="flex flex-col items-center gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top banner */}
      <div className="w-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-5 flex flex-col items-center gap-3 shadow-lg shadow-emerald-200/60">
        {/* Avatar */}
        <div className="relative">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white/80 shadow-xl"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/80">
              <User className="w-10 h-10 text-white" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-white">Welcome back!</h3>
          <p className="text-emerald-100 font-semibold text-base">{user.name}</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-medium">Identity verified</span>
        </div>
      </div>

      {/* User info card */}
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          <InfoRow icon={<Hash className="w-3.5 h-3.5" />} label="Employee ID" value={`#${user.numericId}`} color="text-emerald-600" bg="bg-emerald-50" />
          <InfoRow icon={<Building2 className="w-3.5 h-3.5" />} label="Department" value={user.department || "N/A"} color="text-purple-600" bg="bg-purple-50" />
          <InfoRow icon={<Briefcase className="w-3.5 h-3.5" />} label="Role" value={user.accountType} color="text-blue-600" bg="bg-blue-50" />
          {user.position && (
            <InfoRow icon={<Briefcase className="w-3.5 h-3.5" />} label="Position" value={user.position} color="text-orange-600" bg="bg-orange-50" />
          )}
        </div>
      </div>

      {/* Redirecting indicator */}
      <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2.5 w-full justify-center">
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        <span className="text-sm text-blue-600 font-medium">Redirecting to your dashboard...</span>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string; color: string; bg: string }) {
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2.5">
      <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
        <span className={`${bg} ${color} p-1 rounded-md`}>{icon}</span>
        {label}
      </span>
      <span className={`text-xs font-bold ${color} truncate max-w-[160px]`}>
        {value}
      </span>
    </div>
  );
}

export default function FaceLoginCamera({ onCancel }: FaceLoginCameraProps) {
  const { step, error, attempts, videoRef, recognizedUser, sessionBlocked, blockedBy, captureAndLogin, cancel, maxAttempts } =
    useFaceLogin(onCancel);

  const isProcessing = step === "processing";
  const isLocked = attempts >= maxAttempts;
  const isSuccess = step === "success" && recognizedUser;

  return (
    <Card>
      {sessionBlocked && <SessionBlockedModal onClose={cancel} blockedBy={blockedBy} />}
      <div className="flex flex-col items-center gap-4">
        {/* Header */}
        {!isSuccess && (
          <>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-800">
                Face Recognition Login
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Position your face in the oval and click capture
              </p>
            </div>
          </>
        )}

        {/* Success screen */}
        {isSuccess ? (
          <SuccessScreen user={recognizedUser} />
        ) : (
          <>
            {/* Camera preview */}
            <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />

              {/* Scanning oval guide */}
              <FaceOvalGuide isProcessing={isProcessing} />

              {/* Processing overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                  <span className="text-white text-sm font-medium">Recognizing face...</span>
                </div>
              )}

              {/* Top status badge */}
              {!isProcessing && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 backdrop-blur-md bg-black/30 rounded-full px-4 py-1.5 border border-white/20">
                  <p className="text-white text-xs font-medium">
                    📷 Camera ready
                  </p>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="w-full bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 flex items-start gap-2">
                <span className="text-red-500 text-sm mt-0.5">⚠</span>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Attempt counter */}
            {attempts > 0 && !isLocked && (
              <div className="flex items-center gap-1.5">
                {Array.from({ length: maxAttempts }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < attempts ? "bg-red-400" : "bg-gray-200"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-400 ml-1">
                  {maxAttempts - attempts} attempt{maxAttempts - attempts !== 1 ? "s" : ""} left
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={cancel}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={captureAndLogin}
                disabled={isProcessing || isLocked}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-blue-200/50 hover:shadow-lg hover:shadow-blue-300/50"
              >
                <Camera className="w-4 h-4" />
                {isProcessing ? "Recognizing..." : "Capture & Login"}
              </button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
