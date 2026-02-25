import { AlertTriangle, Shield, User as UserIcon, ArrowRight, XCircle } from "lucide-react";
import Image from "next/image";

interface ErrorOverlayProps {
  showUnauthorizedWarning?: boolean;
  recognizedName?: string;
  recognizedImage?: string;
  recognizedUser?: Record<string, unknown>;
  expectedUser?: Record<string, unknown>;
}

export default function ErrorOverlay({ showUnauthorizedWarning, recognizedName, recognizedImage, recognizedUser, expectedUser }: ErrorOverlayProps) {
  if (showUnauthorizedWarning && recognizedName && recognizedUser) {
    return (
      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-linear-to-br from-red-50/95 to-red-100/95 p-3">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 border-2 border-red-200">
          {/* Header */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-600 rounded-full p-2.5 shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-center text-red-900 mb-1.5">
            Unauthorized Access Detected
          </h3>
          <p className="text-center text-red-700 text-xs mb-4">
            Security violation - Attendance fraud attempt
          </p>

          {/* User Comparison */}
          <div className="bg-linear-to-r from-red-50 to-orange-50 rounded-xl p-3 mb-4">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
              {/* Detected Person */}
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-1.5">
                  {recognizedImage ? (
                    <Image
                      src={recognizedImage}
                      alt={recognizedName}
                      fill
                      className="rounded-full object-cover border-3 border-red-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center border-3 border-red-500">
                      <UserIcon className="w-8 h-8 text-red-600" />
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 bg-red-600 rounded-full p-1 shadow-md">
                    <XCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <p className="text-[10px] font-semibold text-red-900 mb-0.5">Detected</p>
                <p className="text-xs font-bold text-red-700 truncate">{recognizedName}</p>
                <p className="text-[10px] text-red-600 mt-0.5">ID: {(recognizedUser?.numericId as string) || 'N/A'}</p>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center">
                <XCircle className="w-5 h-5 text-red-600 mb-0.5" />
                <ArrowRight className="w-4 h-4 text-red-500" />
              </div>

              {/* Expected Person */}
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-1.5">
                  {expectedUser?.image ? (
                    <Image
                      src={expectedUser.image as string}
                      alt={(expectedUser.name as string) || 'Expected User'}
                      fill
                      className="rounded-full object-cover border-3 border-green-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center border-3 border-green-500">
                      <UserIcon className="w-8 h-8 text-green-600" />
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 bg-green-600 rounded-full p-1 shadow-md">
                    <Shield className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <p className="text-[10px] font-semibold text-green-900 mb-0.5">Expected</p>
                <p className="text-xs font-bold text-green-700 truncate">{(expectedUser?.name as string) || 'N/A'}</p>
                <p className="text-[10px] text-green-600 mt-0.5">ID: {(expectedUser?.numericId as string) || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-3 mb-3">
            <p className="text-xs text-red-900 font-semibold mb-1.5">
              ⚠️ Security Alert
            </p>
            <p className="text-[11px] text-red-800 leading-relaxed">
              <span className="font-bold">{recognizedName}</span> attempted to mark attendance for <span className="font-bold">{(expectedUser?.name as string) || 'another user'}</span>. This action violates company policy and will be reported to management.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-[10px] text-gray-600">
              Repeated violations may result in disciplinary action
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-100/80">
      <div className="text-center max-w-sm mx-4">
        <div className="w-20 h-20 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
          <AlertTriangle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-2">
          Verification Failed
        </h3>
        <p className="text-sm sm:text-base text-[#555] font-medium">
          Please try again.
        </p>
      </div>
    </div>
  );
}