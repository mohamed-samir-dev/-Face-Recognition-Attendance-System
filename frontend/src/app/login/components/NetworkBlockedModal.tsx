"use client";

import { ShieldAlert, Wifi, WifiOff, Globe, X, Flag, Lock } from "lucide-react";

interface NetworkBlockedModalProps {
  onClose: () => void;
  currentIp: string | null;
  flagCount?: number;
  accountLocked?: boolean;
}

export default function NetworkBlockedModal({ onClose, currentIp, flagCount = 0, accountLocked = false }: NetworkBlockedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-md mx-auto overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Top banner */}
        <div className={`relative bg-gradient-to-r ${accountLocked ? "from-red-700 to-red-900" : flagCount >= 1 ? "from-red-500 to-orange-600" : "from-orange-500 to-red-500"} px-4 sm:px-6 py-4 sm:py-5 flex flex-col items-center gap-2`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center">
            {accountLocked ? <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-white" /> : flagCount >= 1 ? <Flag className="w-7 h-7 sm:w-8 sm:h-8 text-white" /> : <WifiOff className="w-7 h-7 sm:w-8 sm:h-8 text-white" />}
          </div>
          <h2 className="text-white text-base sm:text-lg font-bold text-center">
            {accountLocked ? "Account Suspended" : flagCount >= 1 ? "⚠️ First Warning — IP Flag" : "Unauthorized Network"}
          </h2>
          <p className="text-orange-100 text-xs font-medium">
            {accountLocked
              ? "Account suspended — contact Admin or wait until next week"
              : flagCount >= 1
              ? "One more violation this week will suspend your account"
              : "Login Blocked — Unrecognized Network"}
          </p>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4">

          {/* Current IP */}
          {currentIp && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Your Current Network
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center ring-2 ring-red-200 shrink-0">
                  <Globe className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base font-mono">{currentIp}</p>
                  <p className="text-xs text-red-500 font-medium mt-0.5">Not in allowed list</p>
                </div>
              </div>
            </div>
          )}

          {/* Flag counter */}
          {flagCount > 0 && (
            <div className={`rounded-xl p-3 text-center space-y-1 border ${
              accountLocked
                ? "bg-red-100 border-red-200"
                : "bg-amber-50 border-amber-200"
            }`}>
              <div className="flex items-center justify-center gap-2">
                {[1, 2].map((n) => (
                  <Flag
                    key={n}
                    className={`w-5 h-5 ${
                      n <= flagCount
                        ? accountLocked ? "text-red-600" : "text-amber-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-sm font-bold ${ accountLocked ? "text-red-700" : "text-amber-700"}`}>
                {accountLocked
                  ? "You have received 2 IP flags — Account suspended until Admin review"
                  : "This is your 1st IP flag — 1 warning remaining this week"}
              </p>
            </div>
          )}

          {/* Warning */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center space-y-1">
            <p className="text-sm font-bold text-red-700">
              {accountLocked
                ? "Account suspended — unauthorized IP violations"
                : "You are trying to log in from an unauthorized network"}
            </p>
            <p className="text-xs text-red-400 leading-relaxed">
              {accountLocked
                ? "Your account was automatically suspended after 2 IP flags. You must contact the Admin to restore access, or flags reset automatically after one week."
                : "Access is restricted to company-approved networks only. This attempt has been logged."}
            </p>
          </div>

          {/* Info */}
          {!accountLocked && (
            <div className="space-y-2">
              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                <Wifi className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Please connect to the <span className="font-semibold text-gray-800">company WiFi</span> and try again.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-3">
                <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  A second unauthorized attempt this week will <span className="font-semibold">automatically suspend your account</span> and notify the Admin.
                </p>
              </div>
            </div>
          )}
          {accountLocked && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
              <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-700 leading-relaxed">
                Please <span className="font-semibold">contact your system administrator</span> to restore access immediately, or wait until next week for automatic flag reset.
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md shadow-red-200/50 cursor-pointer"
          >
            {accountLocked ? "Close" : "Understood"}
          </button>
        </div>
      </div>
    </div>
  );
}
