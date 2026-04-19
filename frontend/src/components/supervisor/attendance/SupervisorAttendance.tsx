"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Calendar, CheckCircle, XCircle, Coffee, AlertCircle,
  Clock, MapPin, ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, Search, Filter, ExternalLink,
} from "lucide-react";
import { AttendanceHistoryRecord } from "@/lib/types/attendanceHistory";

interface Props {
  fetchData: () => Promise<AttendanceHistoryRecord[]>;
  title: string;
  subtitle: string;
}

const STATUS_CFG = {
  Present: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
  Late:    { dot: "bg-amber-500",   bg: "bg-amber-50",   text: "text-amber-700",   icon: AlertCircle },
  OnLeave: { dot: "bg-sky-500",     bg: "bg-sky-50",     text: "text-sky-700",     icon: Coffee      },
  Absent:  { dot: "bg-rose-500",    bg: "bg-rose-50",    text: "text-rose-700",    icon: XCircle     },
} as const;

function fmt12(t?: string) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function dayLabel(dateStr: string) {
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yest = new Date(today); yest.setDate(today.getDate() - 1);
  if (d.getTime() === today.getTime()) return "Today";
  if (d.getTime() === yest.getTime()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

type SortKey = "employeeName" | "status" | "department" | "jobTitle" | "checkIn" | "checkOut" | "workedHours" | "lateMinutes" | "geofenceStatus" | "locationAddress" | "ipAddress" | "deviceInfo";
type SortDir = "asc" | "desc" | null;

export default function AttendanceTableView({ fetchData, title, subtitle }: Props) {
  const [history, setHistory] = useState<AttendanceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeStatus, setActiveStatus] = useState<string>("All");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const load = useCallback(async () => {
    try { setHistory(await fetchData()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [fetchData]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let d = filterDate ? history.filter((r) => r.date === filterDate) : history;
    if (activeStatus !== "All") d = d.filter((r) => r.status === activeStatus);
    if (globalFilter) {
      const q = globalFilter.toLowerCase();
      d = d.filter((r) =>
        (r.employeeName?.toLowerCase().includes(q)) ||
        (r.department?.toLowerCase().includes(q)) ||
        (r.numericId?.toString().includes(q))
      );
    }
    return d;
  }, [history, filterDate, activeStatus, globalFilter]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortKey] ?? "";
      const bv = (b as unknown as Record<string, unknown>)[sortKey] ?? "";
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = useMemo(() => sorted.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize), [sorted, pageIndex, pageSize]);

  const toggleSort = useCallback((key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); }
    else if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir(null); }
    setPageIndex(0);
  }, [sortKey, sortDir]);

  // Summary counts
  const counts = useMemo(() => ({
    present: filtered.filter((r) => r.status === "Present").length,
    late:    filtered.filter((r) => r.status === "Late").length,
    onLeave: filtered.filter((r) => r.status === "OnLeave").length,
    absent:  filtered.filter((r) => r.status === "Absent").length,
  }), [filtered]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading attendance…</p>
      </div>
    </div>
  );

  const statusTabs = [
    { key: "All",     label: "All",      count: filtered.length,  color: "indigo" },
    { key: "Present", label: "Present",  count: counts.present,   color: "emerald" },
    { key: "Late",    label: "Late",     count: counts.late,      color: "amber" },
    { key: "OnLeave", label: "On Leave", count: counts.onLeave,   color: "sky" },
    { key: "Absent",  label: "Absent",   count: counts.absent,    color: "rose" },
  ];

  const tabActive: Record<string, string> = {
    indigo: "bg-indigo-600 text-white",
    emerald: "bg-emerald-600 text-white",
    amber: "bg-amber-500 text-white",
    sky: "bg-sky-500 text-white",
    rose: "bg-rose-500 text-white",
  };
  const tabInactive: Record<string, string> = {
    indigo: "text-indigo-600 hover:bg-indigo-50",
    emerald: "text-emerald-600 hover:bg-emerald-50",
    amber: "text-amber-600 hover:bg-amber-50",
    sky: "text-sky-600 hover:bg-sky-50",
    rose: "text-rose-600 hover:bg-rose-50",
  };

  const headers: { key: SortKey | null; label: string }[] = [
    { key: "employeeName", label: "Employee" },
    { key: "status", label: "Status" },
    { key: "department", label: "Department" },
    { key: "jobTitle", label: "Job Title" },
    { key: "checkIn", label: "Check In" },
    { key: "checkOut", label: "Check Out" },
    { key: "workedHours", label: "Hours" },
    { key: "lateMinutes", label: "Late" },
    { key: "geofenceStatus", label: "Geofence" },
    { key: "locationAddress", label: "Location" },
    { key: "ipAddress", label: "IP" },
    { key: "deviceInfo", label: "Device" },
  ];

  // Group rows by date for visual separation
  const renderRows = () => {
    const result: React.ReactNode[] = [];
    let lastDate = "";
    paged.forEach((r, i) => {
      const date = r.date;
      if (date !== lastDate) {
        lastDate = date;
        result.push(
          <tr key={`date-${date}`}>
            <td colSpan={headers.length} className="px-4 py-2 bg-slate-50/80 border-y border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  {dayLabel(date)}
                </span>
                <span className="text-xs text-slate-400">· {date}</span>
              </div>
            </td>
          </tr>
        );
      }
      const cfg = STATUS_CFG[r.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.Absent;
      const statusLabel = r.status === "OnLeave" ? "On Leave" : r.status;
      const h = r.workedHours || 0;
      const pct = Math.min(100, (h / 8) * 100);
      const late = r.lateMinutes;

      result.push(
        <tr key={`row-${i}-${date}`}
          className={`border-b border-slate-50 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/20"}`}>
          {/* Employee */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-3 min-w-[160px]">
              <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                <cfg.icon className={`w-4 h-4 ${cfg.text}`} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{r.employeeName}</p>
                <p className="text-xs text-slate-400">#{r.numericId || "—"}</p>
              </div>
            </div>
          </td>
          {/* Status */}
          <td className="px-4 py-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {statusLabel}
            </span>
          </td>
          {/* Department */}
          <td className="px-4 py-3">
            <span className="text-sm text-slate-600">{r.department || "—"}</span>
          </td>
          {/* Job Title */}
          <td className="px-4 py-3">
            <span className="text-sm text-slate-600">{r.jobTitle || "—"}</span>
          </td>
          {/* Check In */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-sm font-semibold text-emerald-600">{fmt12(r.checkIn)}</span>
            </div>
          </td>
          {/* Check Out */}
          <td className="px-4 py-3">
            {r.checkOut ? (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-mono text-sm font-semibold text-rose-500">{fmt12(r.checkOut)}</span>
              </div>
            ) : <span className="text-slate-300 text-sm">—</span>}
          </td>
          {/* Hours */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-2 min-w-[80px]">
              <span className="text-sm font-bold text-slate-700 w-10">{h > 0 ? `${h.toFixed(1)}h` : "—"}</span>
              {h > 0 && (
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${h >= 8 ? "bg-emerald-500" : h >= 6 ? "bg-amber-400" : "bg-rose-400"}`}
                    style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
          </td>
          {/* Late */}
          <td className="px-4 py-3">
            {late && late > 0
              ? <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">+{Math.round(late)}m</span>
              : <span className="text-slate-300 text-sm">—</span>}
          </td>
          {/* Geofence */}
          <td className="px-4 py-3">
            {r.geofenceStatus ? (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.geofenceStatus === "Inside" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
                {r.geofenceStatus}
              </span>
            ) : <span className="text-slate-300 text-sm">—</span>}
          </td>
          {/* Location */}
          <td className="px-4 py-3">
            {r.locationAddress ? (
              <div className="flex items-center gap-1 max-w-[180px]">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                {r.coordinates ? (
                  <a href={`https://www.google.com/maps?q=${r.coordinates}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-indigo-500 hover:underline truncate flex items-center gap-0.5">
                    {r.locationAddress} <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 truncate">{r.locationAddress}</span>
                )}
              </div>
            ) : <span className="text-slate-300 text-sm">—</span>}
          </td>
          {/* IP */}
          <td className="px-4 py-3">
            <span className="font-mono text-xs text-slate-400">{r.ipAddress || "—"}</span>
          </td>
          {/* Device */}
          <td className="px-4 py-3">
            <span className="text-xs text-slate-500 max-w-[120px] truncate block">{r.deviceInfo || "—"}</span>
          </td>
        </tr>
      );
    });
    return result;
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-6 space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
          <Filter className="w-4 h-4 text-slate-400" />
          <input type="date" value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setPageIndex(0); }}
            className="text-sm text-slate-700 border-0 focus:ring-0 focus:outline-none bg-transparent" />
          {filterDate && (
            <button onClick={() => { setFilterDate(""); setPageIndex(0); }}
              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800">Clear</button>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Present",  value: counts.present, cfg: STATUS_CFG.Present },
          { label: "Late",     value: counts.late,    cfg: STATUS_CFG.Late    },
          { label: "On Leave", value: counts.onLeave, cfg: STATUS_CFG.OnLeave },
          { label: "Absent",   value: counts.absent,  cfg: STATUS_CFG.Absent  },
        ].map(({ label, value, cfg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
              <cfg.icon className={`w-5 h-5 ${cfg.text}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Attendance Records</h2>
              <p className="text-xs text-slate-400 mt-0.5">{sorted.length} records</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={globalFilter} onChange={(e) => { setGlobalFilter(e.target.value); setPageIndex(0); }}
                placeholder="Search employee, dept…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50" />
            </div>
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {statusTabs.map(({ key, label, count, color }) => (
              <button key={key} onClick={() => { setActiveStatus(key); setPageIndex(0); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeStatus === key ? tabActive[color] : `bg-slate-50 ${tabInactive[color]}`
                }`}>
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeStatus === key ? "bg-white/20" : "bg-slate-200 text-slate-600"
                }`}>{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "1100px" }}>
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {headers.map((h) => (
                  <th key={h.label} onClick={() => h.key && toggleSort(h.key)}
                    className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700 transition-colors whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {h.label}
                      {h.key && (
                        sortKey === h.key && sortDir === "asc" ? <ChevronUp className="w-3 h-3 text-indigo-500" /> :
                        sortKey === h.key && sortDir === "desc" ? <ChevronDown className="w-3 h-3 text-indigo-500" /> :
                        <ChevronsUpDown className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="text-center py-20">
                    <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-medium">No records found</p>
                  </td>
                </tr>
              ) : renderRows()}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rows per page:</span>
            <select value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPageIndex(0); }}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              {[15, 30, 50, 100].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Page {pageIndex + 1} of {pageCount}
            </span>
            <button onClick={() => setPageIndex((p) => Math.max(0, p - 1))} disabled={pageIndex === 0}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))} disabled={pageIndex >= pageCount - 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
