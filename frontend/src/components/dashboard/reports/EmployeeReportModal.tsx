"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel,
  flexRender, createColumnHelper, SortingState,
} from "@tanstack/react-table";
import {
  X, Download, Clock, TrendingUp, AlertTriangle, Calendar,
  ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Award,
} from "lucide-react";
import { useLeaveDays } from "../hooks/useLeaveDays";
import { useWorkTimer } from "../hooks/useWorkTimer";
import { useOvertimeData } from "../hooks/useOvertimeData";
import { getMonthlyLateArrivals } from "@/lib/services/attendance/attendanceService";
import { getMonthlyAbsences } from "@/lib/services/attendance/absenceService";
import { getUserAttendanceHistory } from "@/lib/services/attendance/attendanceHistoryService";
import { AttendanceHistoryRecord } from "@/lib/types/attendanceHistory";
import { formatHoursForCard } from "@/lib/utils/timeFormatters";
import * as XLSX from "xlsx";

interface TeamMember {
  id: string; name: string; numericId: string | number; jobTitle?: string;
  email?: string; phone?: string; department?: string; Department?: string;
  accountType?: string; status?: string;
}

interface Props { employee: TeamMember; onClose: () => void; }

const columnHelper = createColumnHelper<AttendanceHistoryRecord>();

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Present: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Late:    { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  OnLeave: { bg: "bg-sky-50",     text: "text-sky-700",     dot: "bg-sky-500"     },
  Absent:  { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500"    },
};

export default function EmployeeReportModal({ employee, onClose }: Props) {
  const { leaveDays, vacationDays } = useLeaveDays(employee?.numericId?.toString());
  const { totalHours } = useWorkTimer(employee?.id);
  const { monthlyOvertime } = useOvertimeData(employee?.id);
  const [lateArrivals, setLateArrivals] = useState(0);
  const [absences, setAbsences] = useState(0);
  const [records, setRecords] = useState<AttendanceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  const score = useMemo(() => {
    const total = records.length + absences;
    if (total === 0) return 100;
    const A = records.length / total;
    const H = Math.min(1, totalHours / 160);
    const P = Math.max(0, 1 - lateArrivals / total);
    const O = monthlyOvertime / 160;
    return Math.round((0.4 * A + 0.3 * H + 0.2 * P) * 100 + O * 50);
  }, [records.length, absences, totalHours, lateArrivals, monthlyOvertime]);

  const columns = useMemo(() => [
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
      cell: (i) => <span className="font-mono text-sm font-semibold text-emerald-600">{i.getValue() || "—"}</span>,
    }),
    columnHelper.accessor("checkOut", {
      header: "Check Out",
      cell: (i) => <span className="font-mono text-sm font-semibold text-rose-500">{i.getValue() || "—"}</span>,
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
  ], []);

  const table = useReactTable({
    data: records, columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  useEffect(() => {
    if (!employee?.id) return;
    getUserAttendanceHistory(employee.id).then((d) => { setRecords(d); setLoading(false); });
    getMonthlyLateArrivals(employee.id).then(setLateArrivals);
    getMonthlyAbsences(employee.id).then(setAbsences);
  }, [employee?.id]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["EMPLOYEE REPORT", employee.name],
      ["ID", employee.numericId, "Department", employee.department || employee.Department],
      [],
      ["Total Hours", formatHoursForCard(totalHours), "Overtime", formatHoursForCard(monthlyOvertime)],
      ["Late Days", lateArrivals, "Absences", absences, "Score", `${score}%`],
      [],
      ["Date", "Check In", "Check Out", "Status", "Hours"],
      ...records.map((r) => [r.date, r.checkIn || "N/A", r.checkOut || "N/A", r.status, r.workedHours?.toFixed(2) || "0.00"]),
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `Report_${employee.name}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const scoreColor = score >= 90 ? "text-emerald-600" : score >= 75 ? "text-amber-500" : "text-rose-500";
  const scoreRing  = score >= 90 ? "stroke-emerald-500" : score >= 75 ? "stroke-amber-400" : "stroke-rose-500";
  const circumference = 2 * Math.PI * 36;

  const stats = [
    { label: "Total Hours",   value: formatHoursForCard(totalHours),       icon: Clock,         color: "bg-indigo-500" },
    { label: "Overtime",      value: formatHoursForCard(monthlyOvertime),   icon: TrendingUp,    color: "bg-violet-500" },
    { label: "Days Worked",   value: records.length,                        icon: Calendar,      color: "bg-sky-500"    },
    { label: "Late Arrivals", value: lateArrivals,                          icon: AlertTriangle, color: "bg-amber-500"  },
    { label: "Absences",      value: absences,                              icon: AlertTriangle, color: "bg-rose-500"   },
    { label: "Leave Taken",   value: `${leaveDays}/${vacationDays}`,        icon: Calendar,      color: "bg-teal-500"   },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-50 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{employee.name}</h2>
            <p className="text-xs text-slate-400">{employee.jobTitle || "Employee"} · ID #{employee.numericId}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Score + Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center justify-center gap-1">
                  <svg width="90" height="90" className="-rotate-90">
                    <circle cx="45" cy="45" r="36" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle
                      cx="45" cy="45" r="36" fill="none" strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (score / 100) * circumference}
                      strokeLinecap="round"
                      className={`${scoreRing} transition-all duration-700`}
                    />
                  </svg>
                  <p className={`text-2xl font-black -mt-1 ${scoreColor}`}>{score}%</p>
                  <div className="flex items-center gap-1">
                    <Award className={`w-3.5 h-3.5 ${scoreColor}`} />
                    <span className={`text-xs font-semibold ${scoreColor}`}>
                      {score >= 90 ? "Excellent" : score >= 75 ? "Good" : "Needs Improvement"}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stats.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
                      <div className={`${color} w-9 h-9 rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-800">{value}</p>
                        <p className="text-[11px] text-slate-500">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">Attendance History</h3>
                  <p className="text-xs text-slate-400">{records.length} records</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {table.getHeaderGroups()[0].headers.map((h) => (
                          <th
                            key={h.id}
                            onClick={h.column.getToggleSortingHandler()}
                            className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 transition-colors"
                          >
                            <div className="flex items-center gap-1">
                              {flexRender(h.column.columnDef.header, h.getContext())}
                              {h.column.getCanSort() && (
                                <span>
                                  {h.column.getIsSorted() === "asc" ? (
                                    <ChevronUp className="w-3 h-3 text-indigo-500" />
                                  ) : h.column.getIsSorted() === "desc" ? (
                                    <ChevronDown className="w-3 h-3 text-indigo-500" />
                                  ) : (
                                    <ChevronsUpDown className="w-3 h-3 text-slate-300" />
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
                          <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">No records</td>
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
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </span>
                  <div className="flex items-center gap-2">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
