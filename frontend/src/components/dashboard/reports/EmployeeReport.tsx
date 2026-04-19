"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import {
  Download, FileText, TrendingUp, Clock, AlertTriangle,
  Calendar, ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, Search, Users, Award,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLeaveDays } from "../hooks/useLeaveDays";
import { useWorkTimer } from "../hooks/useWorkTimer";
import { useOvertimeData } from "../hooks/useOvertimeData";
import { getMonthlyLateArrivals } from "@/lib/services/attendance/attendanceService";
import { getMonthlyAbsences } from "@/lib/services/attendance/absenceService";
import { getUserAttendanceHistory } from "@/lib/services/attendance/attendanceHistoryService";
import { AttendanceHistoryRecord } from "@/lib/types/attendanceHistory";
import { formatHoursForCard } from "@/lib/utils/timeFormatters";
import { getTeamMembers } from "@/lib/services/team/teamService";
import EmployeeReportModal from "./EmployeeReportModal";
import * as XLSX from "xlsx";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface TeamMember {
  id: string;
  name: string;
  numericId: string | number;
  jobTitle?: string;
}

const columnHelper = createColumnHelper<AttendanceHistoryRecord>();

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Present:  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Late:     { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  OnLeave:  { bg: "bg-sky-50",     text: "text-sky-700",     dot: "bg-sky-500"     },
  Absent:   { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500"    },
};

export default function EmployeeReport() {
  const { user } = useAuth();
  const { leaveDays, vacationDays } = useLeaveDays(user?.numericId?.toString());
  const { totalHours } = useWorkTimer(user?.id);
  const { monthlyOvertime } = useOvertimeData(user?.id);
  const [lateArrivals, setLateArrivals] = useState(0);
  const [absences, setAbsences] = useState(0);
  const [records, setRecords] = useState<AttendanceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<TeamMember | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const isSupervisor = user?.accountType === "Supervisor";

  const score = useMemo(() => {
    const total = records.length + absences;
    if (total === 0) return 100;
    const A = records.length / total;
    const H = Math.min(1, totalHours / 160);
    const P = Math.max(0, 1 - lateArrivals / total);
    const O = monthlyOvertime / 160;
    return Math.round((0.4 * A + 0.3 * H + 0.2 * P) * 100 + O * 50);
  }, [records.length, absences, totalHours, lateArrivals, monthlyOvertime]);

  const overtimeData = useMemo(() => {
    if (!records.length) return [];
    const dates = records.map((r) => new Date(r.date));
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    const result = [];
    for (const d = new Date(min); d <= max; d.setDate(d.getDate() + 1)) {
      const ds = d.toISOString().split("T")[0];
      const ot = records
        .filter((r) => r.date === ds)
        .reduce((s, r) => s + Math.max(0, (r.workedHours || 0) - 8), 0);
      result.push({ date: ds.slice(5), overtime: +ot.toFixed(2) });
    }
    return result;
  }, [records]);

  const weeklyData = useMemo(() => {
    return records.reduce((acc, r) => {
      const d = new Date(r.date);
      const ws = new Date(d.setDate(d.getDate() - d.getDay()));
      const we = new Date(ws); we.setDate(ws.getDate() + 6);
      const label = `${ws.getDate()}/${ws.getMonth() + 1}–${we.getDate()}/${we.getMonth() + 1}`;
      const ex = acc.find((i) => i.week === label);
      if (ex) ex.hours = +(ex.hours + (r.workedHours || 0)).toFixed(2);
      else acc.push({ week: label, hours: +(r.workedHours || 0).toFixed(2) });
      return acc;
    }, [] as { week: string; hours: number }[]);
  }, [records]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date",
        cell: (i) => (
          <div>
            <div className="font-semibold text-slate-800 text-sm">{i.getValue()}</div>
            <div className="text-xs text-slate-400">
              {new Date(i.getValue()).toLocaleDateString("en-US", { weekday: "short" })}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("checkIn", {
        header: "Check In",
        cell: (i) => (
          <span className="font-mono text-sm font-semibold text-emerald-600">
            {i.getValue() || "—"}
          </span>
        ),
      }),
      columnHelper.accessor("checkOut", {
        header: "Check Out",
        cell: (i) => (
          <span className="font-mono text-sm font-semibold text-rose-500">
            {i.getValue() || "—"}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (i) => {
          const cfg = statusConfig[i.getValue()] ?? statusConfig.Absent;
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {i.getValue()}
            </span>
          );
        },
      }),
      columnHelper.accessor("lateMinutes", {
        header: "Late",
        cell: (i) => {
          const v = i.getValue() || 0;
          return (
            <span className={`text-sm font-semibold ${v > 0 ? "text-amber-600" : "text-slate-400"}`}>
              {v > 0 ? `${v}m` : "—"}
            </span>
          );
        },
      }),
      columnHelper.accessor("workedHours", {
        header: "Hours",
        cell: (i) => {
          const h = i.getValue() || 0;
          const pct = Math.min(100, (h / 8) * 100);
          return (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700 w-12">{h.toFixed(1)}h</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[40px]">
                <div
                  className={`h-full rounded-full ${h >= 8 ? "bg-emerald-500" : h >= 6 ? "bg-amber-400" : "bg-rose-400"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("checkInLocation", {
        header: "Location",
        cell: (i) => (
          <span className="text-xs text-slate-500 max-w-[160px] truncate block" title={i.getValue() ?? ""}>
            {i.getValue() || "—"}
          </span>
        ),
      }),
      columnHelper.accessor("ipAddress", {
        header: "IP",
        cell: (i) => (
          <span className="font-mono text-xs text-slate-400">{i.getValue() || "—"}</span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: records,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  useEffect(() => {
    if (!user?.id) return;
    getUserAttendanceHistory(user.id).then((d) => { setRecords(d); setLoading(false); });
    getMonthlyLateArrivals(user.id).then(setLateArrivals);
    getMonthlyAbsences(user.id).then(setAbsences);
    if (user.accountType === "Supervisor") getTeamMembers(user.id).then(setTeamMembers);
  }, [user?.id, user?.accountType]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["EMPLOYEE ATTENDANCE REPORT"],
      [],
      ["Name", user?.name, "ID", user?.numericId],
      ["Email", user?.email, "Department", user?.department || user?.Department],
      [],
      ["SUMMARY"],
      ["Total Hours", formatHoursForCard(totalHours), "Overtime", formatHoursForCard(monthlyOvertime)],
      ["Late Days", lateArrivals, "Absences", absences],
      ["Days Worked", records.length, "Score", `${score}%`],
      [],
      ["Date", "Check In", "Check Out", "Status", "Late (min)", "Hours", "Location", "IP"],
      ...records.map((r) => [
        r.date,
        r.checkIn || "N/A",
        r.checkOut || "N/A",
        r.status,
        r.lateMinutes || 0,
        r.workedHours?.toFixed(2) || "0.00",
        r.checkInLocation || "N/A",
        r.ipAddress || "N/A",
      ]),
    ]);
    ws["!cols"] = [12, 12, 12, 10, 10, 10, 35, 15].map((w) => ({ width: w }));
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `Report_${user?.name}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading report…</p>
        </div>
      </div>
    );

  const scoreColor =
    score >= 90 ? "text-emerald-600" : score >= 75 ? "text-amber-500" : "text-rose-500";
  const scoreRing =
    score >= 90 ? "stroke-emerald-500" : score >= 75 ? "stroke-amber-400" : "stroke-rose-500";
  const circumference = 2 * Math.PI * 36;

  const stats = [
    { label: "Total Hours",   value: formatHoursForCard(totalHours),                  icon: Clock,         color: "bg-indigo-500" },
    { label: "Overtime",      value: formatHoursForCard(monthlyOvertime),              icon: TrendingUp,    color: "bg-violet-500" },
    { label: "Days Worked",   value: records.length,                                   icon: Calendar,      color: "bg-sky-500"    },
    { label: "Late Arrivals", value: lateArrivals,                                     icon: AlertTriangle, color: "bg-amber-500"  },
    { label: "Absences",      value: absences,                                         icon: AlertTriangle, color: "bg-rose-500"   },
    { label: "Leave Taken",   value: `${leaveDays}/${vacationDays}`,                   icon: Calendar,      color: "bg-teal-500"   },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Report</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {user?.name} · {user?.department || user?.Department || "—"} · ID {user?.numericId}
          </p>
        </div>
        <button
          onClick={exportToExcel}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      {/* ── Score + Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Score ring */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center gap-2">
          <svg width="100" height="100" className="-rotate-90">
            <circle cx="50" cy="50" r="36" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="36" fill="none" strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (score / 100) * circumference}
              strokeLinecap="round"
              className={`${scoreRing} transition-all duration-700`}
            />
          </svg>
          <div className="text-center -mt-2">
            <p className={`text-3xl font-black ${scoreColor}`}>{score}%</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Attendance Score</p>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Award className={`w-4 h-4 ${scoreColor}`} />
            <span className={`text-xs font-semibold ${scoreColor}`}>
              {score >= 90 ? "Excellent" : score >= 75 ? "Good" : "Needs Improvement"}
            </span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Overtime Trend</h3>
          {overtimeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={overtimeData}>
                <defs>
                  <linearGradient id="ot" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12 }}
                  formatter={(v: number | undefined) => [`${v ?? 0}h`, "Overtime"]}
                />
                <Area type="monotone" dataKey="overtime" stroke="#6366f1" strokeWidth={2} fill="url(#ot)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No data yet</div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Weekly Hours</h3>
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12 }}
                  formatter={(v: number | undefined) => [`${v ?? 0}h`, "Hours"]}
                />
                <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No completed sessions</div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Attendance History</h2>
            <p className="text-xs text-slate-400 mt-0.5">{table.getFilteredRowModel().rows.length} records</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search records…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {table.getHeaderGroups()[0].headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && (
                        <span className="text-slate-300">
                          {h.column.getIsSorted() === "asc" ? (
                            <ChevronUp className="w-3 h-3 text-indigo-500" />
                          ) : h.column.getIsSorted() === "desc" ? (
                            <ChevronDown className="w-3 h-3 text-indigo-500" />
                          ) : (
                            <ChevronsUpDown className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-slate-400 text-sm">
                    No records found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-50 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {[10, 20, 50].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Team Members (Supervisor only) ── */}
      {isSupervisor && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Team Members</h2>
              <p className="text-xs text-slate-400">{teamMembers.length} members</p>
            </div>
          </div>
          {teamMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <FileText className="w-10 h-10 text-slate-200" />
              <p className="text-sm text-slate-400">No team members found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {teamMembers.map((m) => (
                <div key={m.id} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.jobTitle || "Employee"} · #{m.numericId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEmployee(m)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Report
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedEmployee && (
        <EmployeeReportModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      )}
    </div>
  );
}
