"use client";

import { useEffect, useState, useCallback } from "react";
import { Calendar, AlertCircle, CheckCircle, XCircle, Coffee, Filter, Clock, MapPin } from "lucide-react";
import { AttendanceHistoryRecord } from "@/lib/types/attendanceHistory";
import { formatHoursForCard } from "@/lib/utils/timeFormatters";

interface AttendanceTableViewProps {
  fetchData: () => Promise<AttendanceHistoryRecord[]>;
  title: string;
  subtitle: string;
}

const STATUS_CONFIG = {
  Present: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  Late:    { icon: AlertCircle, color: "text-amber-600",   bg: "bg-amber-50",   badge: "bg-amber-100 text-amber-700 border border-amber-200" },
  OnLeave: { icon: Coffee,       color: "text-blue-600",    bg: "bg-blue-50",    badge: "bg-blue-100 text-blue-700 border border-blue-200" },
  Absent:  { icon: XCircle,      color: "text-red-600",     bg: "bg-red-50",     badge: "bg-red-100 text-red-700 border border-red-200" },
};

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

function calcDuration(checkIn: string, checkOut?: string) {
  if (!checkOut) return "—";
  const [ih, im] = checkIn.split(":").map(Number);
  const [oh, om] = checkOut.split(":").map(Number);
  const mins = oh * 60 + om - (ih * 60 + im);
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function getDayLabel(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  date.setHours(0, 0, 0, 0);
  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === yesterday.getTime()) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

const COLUMNS = [
  "Employee", "Status", "ID", "Job Title", "Department",
  "Check In", "Check Out", "Duration", "Worked Hours", "Late",
  "Location", "Coordinates", "Accuracy", "Geofence",
  "Main Office", "Branch Office", "IP Address", "Device", "Browser", "Screen", "Timezone",
];

function MobileCard({ record }: { record: AttendanceHistoryRecord }) {
  const cfg = STATUS_CONFIG[record.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.Absent;
  const StatusIcon = cfg.icon;
  const duration = calcDuration(record.checkIn, record.checkOut);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
      {/* Top row: name + status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`${cfg.bg} p-2 rounded-lg`}>
            <StatusIcon className={`w-5 h-5 ${cfg.color}`} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-base">{record.employeeName}</p>
            <p className="text-xs text-gray-400">#{record.numericId || "—"} · {record.department || "—"}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
          {record.status}
        </span>
      </div>

      {/* Job title */}
      {record.jobTitle && (
        <p className="text-sm text-gray-500">{record.jobTitle}</p>
      )}

      {/* Times row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-sm font-semibold text-blue-600">{formatTime(record.checkIn)}</span>
        </div>
        {record.checkOut && (
          <>
            <span className="text-gray-300 text-sm">→</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-sm font-semibold text-purple-600">{formatTime(record.checkOut)}</span>
            </div>
          </>
        )}
        {duration !== "—" && (
          <span className="text-sm font-semibold text-emerald-600">{duration}</span>
        )}
        {record.isLate && record.lateMinutes && (
          <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
            +{Math.round(record.lateMinutes)}m late
          </span>
        )}
      </div>

      {/* Extra info */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-50">
        {record.workedHours && record.workedHours > 0 && (
          <div>
            <p className="text-xs text-gray-400">Worked</p>
            <p className="text-sm font-semibold text-teal-600">{formatHoursForCard(record.workedHours)}</p>
          </div>
        )}
        {record.geofenceStatus && (
          <div>
            <p className="text-xs text-gray-400">Geofence</p>
            <span className={`text-sm font-semibold ${record.geofenceStatus === "Inside" ? "text-emerald-600" : "text-red-500"}`}>
              {record.geofenceStatus}
            </span>
          </div>
        )}
        {record.locationAddress && (
          <div className="col-span-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-400">Location</p>
            </div>
            <p className="text-sm text-gray-600 truncate">{record.locationAddress}</p>
          </div>
        )}
        {record.coordinates && (
          <div className="col-span-2">
            <p className="text-xs text-gray-400">Coordinates</p>
            <a href={`https://www.google.com/maps?q=${record.coordinates}`} target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline font-medium">
              {record.coordinates}
            </a>
          </div>
        )}
        {record.ipAddress && (
          <div>
            <p className="text-xs text-gray-400">IP</p>
            <p className="text-sm text-gray-600 font-mono">{record.ipAddress}</p>
          </div>
        )}
        {record.deviceInfo && (
          <div>
            <p className="text-xs text-gray-400">Device</p>
            <p className="text-sm text-gray-600">{record.deviceInfo}</p>
          </div>
        )}
        {record.accuracy && (
          <div>
            <p className="text-xs text-gray-400">Accuracy</p>
            <p className="text-sm text-gray-600">{Math.round(record.accuracy)}m</p>
          </div>
        )}
        {record.timezone && (
          <div>
            <p className="text-xs text-gray-400">Timezone</p>
            <p className="text-sm text-gray-600">{record.timezone}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AttendanceTableView({ fetchData, title, subtitle }: AttendanceTableViewProps) {
  const [history, setHistory] = useState<AttendanceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchData();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const filtered = filterDate ? history.filter(r => r.date === filterDate) : history;
  const grouped: Record<string, AttendanceHistoryRecord[]> = {};
  filtered.forEach(r => { if (!grouped[r.date]) grouped[r.date] = []; grouped[r.date].push(r); });
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#667eea] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-gray-400 text-sm lg:text-base mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="text-gray-700 text-sm lg:text-base border-0 focus:ring-0 focus:outline-none flex-1 sm:flex-initial"
          />
          {filterDate && (
            <button onClick={() => setFilterDate("")} className="text-sm text-[#667eea] font-semibold">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center shadow-sm">
          <Calendar className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Records Found</h3>
          <p className="text-gray-400">No attendance records available for the selected date.</p>
        </div>
      ) : (
        sortedDates.map(date => {
          const records = grouped[date];
          const stats = {
            present: records.filter(r => r.status === "Present").length,
            late:    records.filter(r => r.status === "Late").length,
            onLeave: records.filter(r => r.status === "OnLeave").length,
            absent:  records.filter(r => r.status === "Absent").length,
          };

          return (
            <div key={date} className="space-y-3">

              {/* Date Header */}
              <div className="bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-2xl p-4 lg:p-5 shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2.5 rounded-xl">
                      <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg lg:text-xl font-bold text-white">{getDayLabel(date)}</h2>
                      <p className="text-white/70 text-sm">{records.length} records</p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { label: "Present", count: stats.present, icon: CheckCircle },
                      { label: "Late",    count: stats.late,    icon: AlertCircle },
                      { label: "Leave",   count: stats.onLeave, icon: Coffee },
                      { label: "Absent",  count: stats.absent,  icon: XCircle },
                    ].map(({ label, count, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-lg">
                        <Icon className="w-4 h-4 text-white" />
                        <span className="text-sm font-semibold text-white">{count} {label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {records.map(record => <MobileCard key={record.id} record={record} />)}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: "1800px" }}>
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {COLUMNS.map(col => (
                          <th key={col} className="px-4 py-3 text-left text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {records.map(record => {
                        const cfg = STATUS_CONFIG[record.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.Absent;
                        const StatusIcon = cfg.icon;
                        return (
                          <tr key={record.id} className="hover:bg-gray-50/70 transition-colors">

                            {/* Employee */}
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <div className={`${cfg.bg} p-1.5 rounded-lg`}>
                                  <StatusIcon className={`w-4 h-4 lg:w-5 lg:h-5 ${cfg.color}`} />
                                </div>
                                <span className="font-semibold text-gray-900 text-sm lg:text-base">{record.employeeName}</span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${cfg.badge}`}>
                                {record.status}
                              </span>
                            </td>

                            {/* ID */}
                            <td className="px-4 py-3.5 text-sm lg:text-base text-gray-600 whitespace-nowrap font-mono">
                              {record.numericId || "—"}
                            </td>

                            {/* Job Title */}
                            <td className="px-4 py-3.5 text-sm lg:text-base text-gray-700 whitespace-nowrap">
                              {record.jobTitle || "—"}
                            </td>

                            {/* Department */}
                            <td className="px-4 py-3.5 text-sm lg:text-base text-gray-700 whitespace-nowrap">
                              {record.department || "—"}
                            </td>

                            {/* Check In */}
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-sm lg:text-base font-semibold text-blue-600">{formatTime(record.checkIn)}</span>
                              </div>
                            </td>

                            {/* Check Out */}
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              {record.checkOut ? (
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                                  <span className="text-sm lg:text-base font-semibold text-purple-600">{formatTime(record.checkOut)}</span>
                                </div>
                              ) : <span className="text-gray-300">—</span>}
                            </td>

                            {/* Duration */}
                            <td className="px-4 py-3.5 text-sm lg:text-base font-semibold text-emerald-600 whitespace-nowrap">
                              {calcDuration(record.checkIn, record.checkOut)}
                            </td>

                            {/* Worked Hours */}
                            <td className="px-4 py-3.5 text-sm lg:text-base font-semibold text-teal-600 whitespace-nowrap">
                              {record.workedHours && record.workedHours > 0 ? formatHoursForCard(record.workedHours) : "—"}
                            </td>

                            {/* Late */}
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              {record.isLate && record.lateMinutes ? (
                                <span className="text-sm lg:text-base font-semibold text-amber-500">
                                  +{Math.round(record.lateMinutes)}m
                                </span>
                              ) : <span className="text-gray-300">—</span>}
                            </td>

                            {/* Location */}
                            <td className="px-4 py-3.5 text-sm lg:text-base text-gray-600 max-w-[200px] truncate" title={record.locationAddress}>
                              {record.locationAddress || "—"}
                            </td>

                            {/* Coordinates */}
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              {record.coordinates ? (
                                <a href={`https://www.google.com/maps?q=${record.coordinates}`} target="_blank" rel="noopener noreferrer"
                                  className="text-sm lg:text-base text-blue-500 hover:underline font-medium">
                                  {record.coordinates}
                                </a>
                              ) : <span className="text-gray-300">—</span>}
                            </td>

                            {/* Accuracy */}
                            <td className="px-4 py-3.5 text-sm lg:text-base text-gray-600 whitespace-nowrap">
                              {record.accuracy ? `${Math.round(record.accuracy)}m` : "—"}
                            </td>

                            {/* Geofence */}
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              {record.geofenceStatus ? (
                                <span className={`px-2.5 py-1 rounded-full text-xs lg:text-sm font-semibold ${
                                  record.geofenceStatus === "Inside"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-600"
                                }`}>
                                  {record.geofenceStatus}
                                </span>
                              ) : <span className="text-gray-300">—</span>}
                            </td>

                            {/* Main Office */}
                            <td className="px-4 py-3.5 text-sm lg:text-base font-medium whitespace-nowrap">
                              {record.mainOffice ? (
                                <span className={record.mainOffice.includes("✓") ? "text-emerald-600" : "text-red-500"}>
                                  {record.mainOffice}
                                </span>
                              ) : <span className="text-gray-300">—</span>}
                            </td>

                            {/* Branch Office */}
                            <td className="px-4 py-3.5 text-sm lg:text-base font-medium whitespace-nowrap">
                              {record.branchOffice ? (
                                <span className={record.branchOffice.includes("✓") ? "text-emerald-600" : "text-red-500"}>
                                  {record.branchOffice}
                                </span>
                              ) : <span className="text-gray-300">—</span>}
                            </td>

                            {/* IP */}
                            <td className="px-4 py-3.5 text-sm lg:text-base text-gray-600 whitespace-nowrap font-mono">
                              {record.ipAddress || "—"}
                            </td>

                            {/* Device */}
                            <td className="px-4 py-3.5 text-sm lg:text-base text-gray-600 whitespace-nowrap">
                              {record.deviceInfo || "—"}
                            </td>

                            {/* Browser */}
                            <td className="px-4 py-3.5 text-sm lg:text-base text-gray-600 max-w-[180px] truncate" title={record.browser}>
                              {record.browser || "—"}
                            </td>

                            {/* Screen */}
                            <td className="px-4 py-3.5 text-sm lg:text-base text-gray-600 whitespace-nowrap">
                              {record.screen || "—"}
                            </td>

                            {/* Timezone */}
                            <td className="px-4 py-3.5 text-sm lg:text-base text-gray-600 whitespace-nowrap">
                              {record.timezone || "—"}
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          );
        })
      )}
    </div>
  );
}
