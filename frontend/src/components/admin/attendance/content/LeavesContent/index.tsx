"use client";

import { useState, useMemo, useCallback } from "react";
import {
  FileText, Clock, CheckCircle, XCircle, CalendarDays,
  ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, Search, Eye, Trash2, AlertCircle,
} from "lucide-react";
import { useLeaveRequests } from "@/components/admin/attendance/hooks/data/useLeaveRequests";
import Toast from "@/components/common/toasts/Toast";
import { LeavesContentProps, LeaveRequest } from "../../types";
import { useLeaveActions } from "../../hooks/actions/useLeaveActions";
import { useModalState } from "../../hooks/ui/useModalState";
import { ModalsContainer } from "./components";

const STATUS_CFG = {
  Pending:  { dot: "bg-amber-500",  bg: "bg-amber-50",  text: "text-amber-700"  },
  Approved: { dot: "bg-emerald-500",bg: "bg-emerald-50",text: "text-emerald-700"},
  Rejected: { dot: "bg-rose-500",   bg: "bg-rose-50",   text: "text-rose-700"   },
  Expired:  { dot: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-700" },
} as const;

const LEAVE_TYPE_COLOR: Record<string, string> = {
  "Vacation":        "bg-sky-50 text-sky-700",
  "Sick Leave":      "bg-rose-50 text-rose-700",
  "Personal Leave":  "bg-indigo-50 text-indigo-700",
  "Maternity Leave": "bg-pink-50 text-pink-700",
  "Paternity Leave": "bg-teal-50 text-teal-700",
};

function getEffectiveStatus(r: LeaveRequest) {
  return new Date(r.endDate) < new Date() && r.status === "Approved" ? "Expired" : r.status;
}

type SortKey = "employeeName" | "leaveType" | "startDate" | "leaveDays" | "status" | "reason";
type SortDir = "asc" | "desc" | null;

export default function LeavesContent({ searchQuery }: LeavesContentProps) {
  const { leaveRequests, loading, error, refetch } = useLeaveRequests();
  const [statusFilter, setStatusFilter] = useState("All");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const { toast, setToast, handleStatusUpdate, handleDeleteRequest } = useLeaveActions(refetch);
  const {
    selectedRequest, isModalOpen,
    deleteRequest, isDeleteModalOpen,
    handleViewDetails, handleDelete,
    closeModal, closeDeleteModal,
  } = useModalState();

  const onStatusUpdate = (id: string, status: "Approved" | "Rejected") =>
    handleStatusUpdate(id, status, leaveRequests);

  const onConfirmDelete = async () => {
    if (deleteRequest) { await handleDeleteRequest(deleteRequest); closeDeleteModal(); }
  };

  const mergedFilter = globalFilter || searchQuery;

  const filtered = useMemo(() => {
    let d = leaveRequests;
    if (statusFilter !== "All") {
      d = d.filter((r) => getEffectiveStatus(r) === statusFilter);
    }
    if (mergedFilter) {
      const q = mergedFilter.toLowerCase();
      d = d.filter((r) =>
        (r.employeeName?.toLowerCase().includes(q)) ||
        (r.leaveType?.toLowerCase().includes(q)) ||
        (r.reason?.toLowerCase().includes(q))
      );
    }
    return d;
  }, [leaveRequests, statusFilter, mergedFilter]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
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

  const counts = useMemo(() => ({
    All:      leaveRequests.length,
    Pending:  leaveRequests.filter((r) => r.status === "Pending").length,
    Approved: leaveRequests.filter((r) => r.status === "Approved" && new Date(r.endDate) >= new Date()).length,
    Rejected: leaveRequests.filter((r) => r.status === "Rejected").length,
    Expired:  leaveRequests.filter((r) => new Date(r.endDate) < new Date() && r.status === "Approved").length,
  }), [leaveRequests]);

  const statusTabs = [
    { key: "All",      label: "All",      icon: FileText,     active: "bg-indigo-600 text-white",  inactive: "text-indigo-600 hover:bg-indigo-50"  },
    { key: "Pending",  label: "Pending",  icon: Clock,        active: "bg-amber-500 text-white",   inactive: "text-amber-600 hover:bg-amber-50"    },
    { key: "Approved", label: "Approved", icon: CheckCircle,  active: "bg-emerald-600 text-white", inactive: "text-emerald-600 hover:bg-emerald-50" },
    { key: "Rejected", label: "Rejected", icon: XCircle,      active: "bg-rose-500 text-white",    inactive: "text-rose-600 hover:bg-rose-50"      },
    { key: "Expired",  label: "Expired",  icon: AlertCircle,  active: "bg-violet-600 text-white",  inactive: "text-violet-600 hover:bg-violet-50"  },
  ];

  const stats = [
    { label: "Total",    value: counts.All,      color: "bg-indigo-500",  icon: FileText    },
    { label: "Pending",  value: counts.Pending,  color: "bg-amber-500",   icon: Clock       },
    { label: "Approved", value: counts.Approved, color: "bg-emerald-500", icon: CheckCircle },
    { label: "Rejected", value: counts.Rejected, color: "bg-rose-500",    icon: XCircle     },
    { label: "Expired",  value: counts.Expired,  color: "bg-violet-500",  icon: AlertCircle },
  ];

  const headers: { key: SortKey | null; label: string }[] = [
    { key: "employeeName", label: "Employee" },
    { key: "leaveType", label: "Type" },
    { key: "startDate", label: "Period" },
    { key: "leaveDays", label: "Days" },
    { key: "status", label: "Status" },
    { key: "reason", label: "Reason" },
    { key: null, label: "Actions" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading leave requests…</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-slate-50/60 p-4 md:p-6 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Requests</h1>
          <p className="text-sm text-slate-500 mt-0.5">Review and manage staff leave requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stats.map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`${color} w-9 h-9 rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-slate-100 space-y-3">
            {/* Status tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {statusTabs.map(({ key, label, icon: Icon, active, inactive }) => (
                <button key={key} onClick={() => { setStatusFilter(key); setPageIndex(0); }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === key ? active : `bg-slate-50 ${inactive}`
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    statusFilter === key ? "bg-white/20" : "bg-slate-200 text-slate-600"
                  }`}>{counts[key as keyof typeof counts]}</span>
                </button>
              ))}
            </div>

            {/* Search + count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p className="text-xs text-slate-400">{sorted.length} records</p>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={globalFilter} onChange={(e) => { setGlobalFilter(e.target.value); setPageIndex(0); }}
                  placeholder="Search employee, type…"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50" />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-5 my-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {headers.map((h) => (
                    <th key={h.label} onClick={() => h.key && toggleSort(h.key)}
                      className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700 transition-colors whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {h.label}
                        {h.key && (
                          sortKey === h.key && sortDir === "asc"  ? <ChevronUp   className="w-3 h-3 text-indigo-500" /> :
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
                    <td colSpan={headers.length} className="text-center py-16">
                      <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm font-medium">No leave requests found</p>
                    </td>
                  </tr>
                ) : (
                  paged.map((r, i) => {
                    const eff = getEffectiveStatus(r) as keyof typeof STATUS_CFG;
                    const cfg = STATUS_CFG[eff] ?? STATUS_CFG.Pending;
                    const start = new Date(r.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    const end   = new Date(r.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    return (
                      <tr key={r.id || i}
                        className={`border-b border-slate-50 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-[140px]">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {r.employeeName?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-800 text-sm">{r.employeeName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${LEAVE_TYPE_COLOR[r.leaveType] ?? "bg-slate-100 text-slate-600"}`}>
                            {r.leaveType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <span className="font-semibold text-slate-700">{start}</span>
                            <span className="text-slate-400 mx-1.5">→</span>
                            <span className="font-semibold text-slate-700">{end}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-sm font-bold text-slate-700">{r.leaveDays}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {eff}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-500 max-w-[160px] truncate block" title={r.reason ?? ""}>
                            {r.reason || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleViewDetails(r)}
                              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(r)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
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
                {[15, 30, 50].map((s) => <option key={s} value={s}>{s}</option>)}
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

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible}
        onClose={() => setToast((p) => ({ ...p, isVisible: false }))} />

      <ModalsContainer
        isModalOpen={isModalOpen} selectedRequest={selectedRequest}
        isDeleteModalOpen={isDeleteModalOpen} deleteRequest={deleteRequest}
        onCloseModal={closeModal} onCloseDeleteModal={closeDeleteModal}
        onStatusUpdate={onStatusUpdate} onConfirmDelete={onConfirmDelete}
      />
    </>
  );
}
