"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { unlockIpFlag } from "@/lib/services/system/networkService";
import { Flag, Lock, LockOpen, Globe, Clock, User, Building2, Fingerprint, KeyRound } from "lucide-react";

interface IpFlagLog {
  id: string;
  userId: string;
  name: string;
  image?: string;
  department?: string;
  ip: string | null;
  loginMethod: "password" | "face";
  flagCount: number;
  locked: boolean;
  timestamp: { toDate: () => Date } | null;
  resolved: boolean;
}

export default function IpFlagsView() {
  const [logs, setLogs] = useState<IpFlagLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState<string | null>(null);
  const [filter, setFilter] = useState<"active" | "all">("active");

  const fetchLogs = async () => {
    setLoading(true);
    const q = query(collection(db, "ipFlagLogs"), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as IpFlagLog)));
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleUnlock = async (log: IpFlagLog) => {
    setUnlocking(log.userId);
    await unlockIpFlag(log.userId);
    await fetchLogs();
    setUnlocking(null);
  };

  const formatTime = (ts: IpFlagLog["timestamp"]) =>
    ts ? ts.toDate().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  const displayed = filter === "active" ? logs.filter((l) => !l.resolved) : logs;
  const activeCount = logs.filter((l) => !l.resolved).length;
  const lockedCount = logs.filter((l) => l.locked && !l.resolved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Flag className="w-5 h-5 text-amber-500" />
            IP Violation Flags
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Users flagged for logging in from unauthorized IP addresses
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none bg-amber-50 border border-amber-100 rounded-xl px-3 sm:px-4 py-2 text-center">
            <p className="text-base sm:text-lg font-bold text-amber-600">{activeCount}</p>
            <p className="text-xs text-gray-500">Active Flags</p>
          </div>
          <div className="flex-1 sm:flex-none bg-red-50 border border-red-100 rounded-xl px-3 sm:px-4 py-2 text-center">
            <p className="text-base sm:text-lg font-bold text-red-600">{lockedCount}</p>
            <p className="text-xs text-gray-500">Suspended</p>
          </div>
          <div className="flex-1 sm:flex-none bg-green-50 border border-green-100 rounded-xl px-3 sm:px-4 py-2 text-center">
            <p className="text-base sm:text-lg font-bold text-green-600">{logs.length - activeCount}</p>
            <p className="text-xs text-gray-500">Resolved</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["active", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f === "active" ? `Active (${activeCount})` : `All (${logs.length})`}
          </button>
        ))}
      </div>

      {/* Logs */}
      {displayed.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Flag className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No {filter === "active" ? "active " : ""}IP flags found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((log) => (
            <FlagCard key={log.id} log={log} formatTime={formatTime} onUnlock={handleUnlock} unlocking={unlocking} />
          ))}
        </div>
      )}
    </div>
  );
}

function FlagCard({ log, formatTime, onUnlock, unlocking }: {
  log: IpFlagLog;
  formatTime: (ts: IpFlagLog["timestamp"]) => string;
  onUnlock: (log: IpFlagLog) => void;
  unlocking: string | null;
}) {
  const isUnlocking = unlocking === log.userId;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
      log.resolved ? "border-gray-100 opacity-60" : log.locked ? "border-red-200" : "border-amber-200"
    }`}>
      {/* Top bar */}
      <div className={`px-3 sm:px-4 py-2 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 ${
        log.resolved ? "bg-gray-50" : log.locked ? "bg-red-50" : "bg-amber-50"
      }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            log.resolved ? "bg-gray-300" : log.locked ? "bg-red-500 animate-pulse" : "bg-amber-500 animate-pulse"
          }`} />
          <span className={`text-xs font-semibold ${
            log.resolved ? "text-gray-400" : log.locked ? "text-red-600" : "text-amber-700"
          }`}>
            {log.resolved ? "Resolved" : log.locked ? "🔒 Account Suspended — 2nd Flag" : "⚠️ 1st IP Flag — Warning Issued"}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-0.5">
            {[1, 2].map((n) => (
              <Flag key={n} className={`w-3.5 h-3.5 ${
                n <= log.flagCount
                  ? log.locked ? "text-red-500" : "text-amber-500"
                  : "text-gray-200"
              }`} />
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
            {log.loginMethod === "face"
              ? <><Fingerprint className="w-3 h-3" />Face</>
              : <><KeyRound className="w-3 h-3" />Password</>}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />{formatTime(log.timestamp)}
          </span>
          {log.locked && !log.resolved && (
            <button
              onClick={() => onUnlock(log)}
              disabled={isUnlocking}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border bg-white text-green-600 border-green-200 hover:bg-green-50 transition-all cursor-pointer disabled:opacity-50"
            >
              {isUnlocking ? (
                <><span className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin inline-block" />Unlocking...</>
              ) : (
                <><LockOpen className="w-3.5 h-3.5" />Unlock Account</>
              )}
            </button>
          )}
          {log.resolved && (
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
              <LockOpen className="w-3.5 h-3.5" />Unlocked
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          {log.image ? (
            <img src={log.image} alt={log.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-100 shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center ring-2 ring-amber-100 shrink-0">
              <User className="w-6 h-6 text-amber-300" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">{log.name}</p>
            {log.department && (
              <div className="flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{log.department}</span>
              </div>
            )}
          </div>
          {log.locked && !log.resolved && (
            <div className="ml-auto flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-xl px-3 py-1.5 shrink-0">
              <Lock className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs font-semibold text-red-600">Account Suspended</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-xs text-gray-400">Flagged IP:</span>
          <span className="text-xs font-mono text-gray-700">{log.ip ?? "Unknown"}</span>
        </div>
      </div>
    </div>
  );
}
