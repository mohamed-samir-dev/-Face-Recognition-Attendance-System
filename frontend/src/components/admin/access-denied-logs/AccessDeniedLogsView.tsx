"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ShieldAlert, User, Building2, Smartphone, Clock, Eye, EyeOff, Fingerprint, KeyRound } from "lucide-react";

interface AccessDeniedLog {
  id: string;
  attemptedBy: {
    userId: string;
    name: string;
    username?: string;
    image?: string;
    department?: string;
  };
  registeredTo: {
    name: string;
    image?: string;
    department?: string;
    position?: string;
  };
  loginMethod: "password" | "face";
  deviceFingerprint: string;
  timestamp: { toDate: () => Date } | null;
  reviewed: boolean;
}

export default function AccessDeniedLogsView() {
  const [logs, setLogs] = useState<AccessDeniedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unreviewed">("unreviewed");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const q = query(collection(db, "accessDeniedLogs"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      setLogs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AccessDeniedLog)));
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const markReviewed = async (logId: string, reviewed: boolean) => {
    await updateDoc(doc(db, "accessDeniedLogs", logId), { reviewed });
    setLogs((prev) => prev.map((l) => l.id === logId ? { ...l, reviewed } : l));
  };

  const formatTime = (ts: AccessDeniedLog["timestamp"]) => {
    if (!ts) return "—";
    return ts.toDate().toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const displayed = filter === "unreviewed" ? logs.filter((l) => !l.reviewed) : logs;
  const unreviewedCount = logs.filter((l) => !l.reviewed).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            Access Denied Logs
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Unauthorized login attempts from foreign devices
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none bg-red-50 border border-red-100 rounded-xl px-3 sm:px-4 py-2 text-center">
            <p className="text-base sm:text-lg font-bold text-red-600">{logs.length}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="flex-1 sm:flex-none bg-amber-50 border border-amber-100 rounded-xl px-3 sm:px-4 py-2 text-center">
            <p className="text-base sm:text-lg font-bold text-amber-600">{unreviewedCount}</p>
            <p className="text-xs text-gray-500">Unreviewed</p>
          </div>
          <div className="flex-1 sm:flex-none bg-green-50 border border-green-100 rounded-xl px-3 sm:px-4 py-2 text-center">
            <p className="text-base sm:text-lg font-bold text-green-600">{logs.length - unreviewedCount}</p>
            <p className="text-xs text-gray-500">Reviewed</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["unreviewed", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f === "unreviewed" ? `Unreviewed (${unreviewedCount})` : `All (${logs.length})`}
          </button>
        ))}
      </div>

      {/* Logs */}
      {displayed.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No {filter === "unreviewed" ? "unreviewed " : ""}logs found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((log) => (
            <LogCard key={log.id} log={log} onToggleReview={markReviewed} formatTime={formatTime} />
          ))}
        </div>
      )}
    </div>
  );
}

function LogCard({ log, onToggleReview, formatTime }: {
  log: AccessDeniedLog;
  onToggleReview: (id: string, reviewed: boolean) => void;
  formatTime: (ts: AccessDeniedLog["timestamp"]) => string;
}) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
      log.reviewed ? "border-gray-100 opacity-70" : "border-red-100"
    }`}>
      {/* Top bar */}
      <div className={`px-3 sm:px-4 py-2 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 ${log.reviewed ? "bg-gray-50" : "bg-red-50"}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${log.reviewed ? "bg-gray-300" : "bg-red-500 animate-pulse"}`} />
          <span className={`text-xs font-semibold ${log.reviewed ? "text-gray-400" : "text-red-600"}`}>
            {log.reviewed ? "Reviewed" : "⚠️ Unauthorized Attempt"}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
            {log.loginMethod === "face"
              ? <><Fingerprint className="w-3 h-3" />Face</>
              : <><KeyRound className="w-3 h-3" />Password</>}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />{formatTime(log.timestamp)}
          </span>
          <button
            onClick={() => onToggleReview(log.id, !log.reviewed)}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border bg-white transition-all cursor-pointer hover:bg-gray-50"
          >
            {log.reviewed
              ? <><EyeOff className="w-3.5 h-3.5 text-gray-400" /><span className="text-gray-400">Unmark</span></>
              : <><Eye className="w-3.5 h-3.5 text-green-600" /><span className="text-green-600">Mark reviewed</span></>}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Attempted by */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Attempted By</p>
          <div className="flex items-center gap-3">
            {log.attemptedBy.image ? (
              <img src={log.attemptedBy.image} alt={log.attemptedBy.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-red-100 shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center ring-2 ring-red-100 shrink-0">
                <User className="w-5 h-5 text-red-300" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{log.attemptedBy.name}</p>
              {log.attemptedBy.username && <p className="text-xs text-gray-400">@{log.attemptedBy.username}</p>}
              {log.attemptedBy.department && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 truncate">{log.attemptedBy.department}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registered to */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Device Registered To</p>
          <div className="flex items-center gap-3">
            {log.registeredTo.image ? (
              <img src={log.registeredTo.image} alt={log.registeredTo.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100 shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center ring-2 ring-blue-100 shrink-0">
                <User className="w-5 h-5 text-blue-300" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{log.registeredTo.name}</p>
              {log.registeredTo.position && <p className="text-xs text-gray-400">{log.registeredTo.position}</p>}
              {log.registeredTo.department && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 truncate">{log.registeredTo.department}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Device fingerprint */}
        <div className="sm:col-span-2 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <Smartphone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-xs text-gray-400">Device ID:</span>
          <span className="text-xs font-mono text-gray-600 truncate">{log.deviceFingerprint}</span>
        </div>
      </div>
    </div>
  );
}
