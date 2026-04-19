"use client";

import { ShieldAlert, MonitorSmartphone, User, Building2, Briefcase, X } from "lucide-react";
import { BlockedByUser } from "@/lib/services/auth/sessionService";

interface SessionBlockedModalProps {
  onClose: () => void;
  blockedBy?: BlockedByUser | null;
}

export default function SessionBlockedModal({ onClose, blockedBy }: SessionBlockedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-md mx-auto overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Red top banner */}
        <div className="relative bg-gradient-to-r from-red-500 to-rose-600 px-4 sm:px-6 py-4 sm:py-5 flex flex-col items-center gap-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-white text-base sm:text-lg font-bold text-center">Access Denied</h2>
          <p className="text-red-100 text-xs font-medium">⚠️ Unauthorized Login Attempt Detected</p>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4">

          {/* Registered user card */}
          {blockedBy && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                This device is registered to
              </p>
              <div className="flex items-center gap-4">
                {/* Avatar */}
                {blockedBy.image ? (
                  <img
                    src={blockedBy.image}
                    alt={blockedBy.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-red-200 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-100 flex items-center justify-center ring-2 ring-red-200 shrink-0">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                  </div>
                )}

                {/* Info */}
                <div className="space-y-1.5 min-w-0">
                  <p className="font-bold text-gray-900 text-base truncate">{blockedBy.name}</p>
                  {blockedBy.department && (
                    <div className="flex items-center gap-1.5 text-xs text-purple-600">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{blockedBy.department}</span>
                    </div>
                  )}
                  {blockedBy.position && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-600">
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{blockedBy.position}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Warning message */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center space-y-1">
            <p className="text-sm font-bold text-red-700">
              This device is already bound to another account
            </p>
            <p className="text-xs text-red-400 leading-relaxed">
              Each device can only be used by one employee. This attempt has been flagged.
            </p>
          </div>

          {/* Info rows */}
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
              <MonitorSmartphone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600 leading-relaxed">
                To use a different device, contact your <span className="font-semibold text-gray-800">Supervisor</span> or <span className="font-semibold text-gray-800">Admin</span> to reset the device binding.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-3">
              <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Repeated unauthorized attempts will be <span className="font-semibold">reported to the system administrator</span>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold hover:from-red-600 hover:to-rose-700 transition-all shadow-md shadow-red-200/50 cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
