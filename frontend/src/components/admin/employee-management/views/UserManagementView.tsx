"use client";

import { useState, useMemo } from "react";
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel,
  flexRender, createColumnHelper, SortingState,
} from "@tanstack/react-table";
import {
  Plus, Download, Users, UserCog, UsersRound, Search,
  ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft,
  ChevronRight, Edit, Key, Bell, Smartphone, Trash2,
  TrendingUp, UserCheck, UserX, Briefcase,
} from "lucide-react";
import Image from "next/image";
import { DeleteModal, ChangePasswordModal } from "../modals";
import { useUserManagement } from "../hooks";
import { User } from "@/lib/types";
import { sendMonitoringAlert } from "@/lib/services/system/monitoringService";
import { resetDeviceBinding } from "@/lib/services/auth/sessionService";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

const columnHelper = createColumnHelper<User>();

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Active:   { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  OnLeave:  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  Inactive: { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500"    },
};

type TabType = "all" | "employees" | "supervisors";

export default function UserManagementView() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const {
    users, departments, loading,
    deleting, deleteModal, changePasswordModal, changingPassword,
    handleDeleteClick, handleDeleteConfirm, handleDeleteCancel,
    handleChangePasswordClick, handleChangePasswordConfirm, handleChangePasswordCancel,
    handleEdit,
  } = useUserManagement();

  const displayUsers = useMemo(() => {
    if (activeTab === "employees") return users.filter((u) => u.accountType === "Employee");
    if (activeTab === "supervisors") return users.filter((u) => u.accountType === "Supervisor" || u.accountType === "Manager");
    return users;
  }, [users, activeTab]);

  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: "Employee",
      cell: (i) => {
        const user = i.row.original;
        let src = user.image;
        try {
          const p = JSON.parse(user.image);
          src = p.profileImage || (Array.isArray(p) ? p[0] : user.image);
        } catch {}
        return (
          <div className="flex items-center gap-3">
            {src ? (
              <Image src={src} alt={user.name} width={36} height={36}
                className="w-9 h-9 rounded-xl object-cover border border-slate-100 shrink-0" unoptimized />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
              <p className="text-xs text-slate-400">#{user.numericId}</p>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("email", {
      header: "Contact",
      cell: (i) => <span className="text-sm text-slate-600">{i.getValue() || "—"}</span>,
    }),
    columnHelper.accessor("department", {
      header: "Department",
      cell: (i) => {
        const dept = i.getValue() || i.row.original.Department;
        return (
          <span className={`text-sm ${dept ? "text-slate-700 font-medium" : "text-slate-400"}`}>
            {dept || "Unassigned"}
          </span>
        );
      },
    }),
    columnHelper.accessor("jobTitle", {
      header: "Job Title",
      cell: (i) => <span className="text-sm text-slate-600">{i.getValue() || "—"}</span>,
    }),
    columnHelper.accessor("accountType", {
      header: "Role",
      cell: (i) => {
        const v = i.getValue() || "Employee";
        const isSuper = v === "Supervisor" || v === "Manager";
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${isSuper ? "bg-violet-50 text-violet-700" : "bg-sky-50 text-sky-700"}`}>
            {isSuper ? <UserCog className="w-3 h-3" /> : <Users className="w-3 h-3" />}
            {v}
          </span>
        );
      },
    }),
    columnHelper.accessor("salary", {
      header: "Salary",
      cell: (i) => {
        const v = i.getValue();
        return <span className="text-sm font-semibold text-slate-700">{v ? `$${v.toLocaleString()}` : "—"}</span>;
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (i) => {
        const v = i.getValue() || "Active";
        const cfg = statusConfig[v] ?? statusConfig.Active;
        const label = v === "OnLeave" ? "On Leave" : v;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {label}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (i) => {
        const user = i.row.original;
        return (
          <div className="flex items-center gap-1">
            <ActionBtn icon={Edit} color="indigo" title="Edit" onClick={() => handleEdit(user.id)} />
            <ActionBtn icon={Key} color="emerald" title="Change Password" onClick={() => handleChangePasswordClick(user)} />
            <ActionBtn icon={Bell} color="amber" title="Send Alert"
              onClick={async () => {
                if (!user.numericId) return;
                try { await sendMonitoringAlert(user.numericId.toString()); toast.success(`Alert sent to ${user.name}`); }
                catch { toast.error("Failed to send alert"); }
              }}
            />
            <ActionBtn icon={Smartphone} color="violet" title="Reset Device"
              onClick={async () => {
                try { await resetDeviceBinding(user.id); toast.success(`Device reset for ${user.name}`); }
                catch { toast.error("Failed to reset device"); }
              }}
            />
            <ActionBtn icon={Trash2} color="rose" title="Delete"
              disabled={deleting === user.id}
              onClick={() => handleDeleteClick(user)}
            />
          </div>
        );
      },
    }),
  ], [deleting, handleEdit, handleDeleteClick, handleChangePasswordClick]);

  const table = useReactTable({
    data: displayUsers,
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

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["USER MANAGEMENT REPORT", new Date().toLocaleDateString()],
      [],
      ["Total", users.length, "Active", users.filter((u) => u.status === "Active").length,
       "Inactive", users.filter((u) => u.status === "Inactive").length,
       "On Leave", users.filter((u) => u.status === "OnLeave").length],
      [],
      ["ID", "Name", "Email", "Phone", "Department", "Job Title", "Role", "Salary", "Status"],
      ...users.map((u) => [
        u.numericId || "N/A", u.name || "N/A", u.email || "N/A", u.phone || "N/A",
        u.department || u.Department || "N/A", u.jobTitle || "N/A",
        u.accountType || "N/A", u.salary || "N/A", u.status || "N/A",
      ]),
    ]);
    ws["!cols"] = [8, 20, 25, 14, 18, 18, 12, 10, 10].map((w) => ({ width: w }));
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, `Users_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading users…</p>
        </div>
      </div>
    );
  }

  const allCount  = users.length;
  const empCount  = users.filter((u) => u.accountType === "Employee").length;
  const supCount  = users.filter((u) => u.accountType === "Supervisor" || u.accountType === "Manager").length;
  const active    = displayUsers.filter((u) => u.status === "Active").length;
  const inactive  = displayUsers.filter((u) => u.status === "Inactive").length;
  const onLeave   = displayUsers.filter((u) => u.status === "OnLeave").length;
  const activeRate = displayUsers.length > 0 ? Math.round((active / displayUsers.length) * 100) : 0;

  const tabs: { key: TabType; label: string; count: number; icon: React.ElementType }[] = [
    { key: "all",         label: "All Staff",   count: allCount, icon: UsersRound },
    { key: "employees",   label: "Employees",   count: empCount, icon: Users      },
    { key: "supervisors", label: "Supervisors", count: supCount, icon: UserCog    },
  ];

  const stats = [
    { label: "Total",       value: displayUsers.length, icon: Users,      color: "bg-indigo-500" },
    { label: "Active",      value: active,              icon: UserCheck,  color: "bg-emerald-500" },
    { label: "Inactive",    value: inactive,            icon: UserX,      color: "bg-rose-500"    },
    { label: "On Leave",    value: onLeave,             icon: Briefcase,  color: "bg-amber-500"   },
    { label: "Departments", value: departments.length,  icon: Briefcase,  color: "bg-violet-500"  },
    { label: "Active Rate", value: `${activeRate}%`,    icon: TrendingUp, color: "bg-sky-500"     },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage system users and their permissions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportToExcel}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => window.location.href = "/admin/add-employee"}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 flex gap-1">
        {tabs.map(({ key, label, count, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === key
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex items-center gap-2.5">
            <div className={`${color} w-8 h-8 rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-800 leading-none">{value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              {activeTab === "all" ? "All Staff" : activeTab === "employees" ? "Employees" : "Supervisors"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{table.getFilteredRowModel().rows.length} records</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search by name, email, ID…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {table.getHeaderGroups()[0].headers.map((h) => (
                  <th key={h.id} onClick={h.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700 transition-colors">
                    <div className="flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && (
                        h.column.getIsSorted() === "asc" ? <ChevronUp className="w-3 h-3 text-indigo-500" /> :
                        h.column.getIsSorted() === "desc" ? <ChevronDown className="w-3 h-3 text-indigo-500" /> :
                        <ChevronsUpDown className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16 text-slate-400 text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <tr key={row.id}
                    className={`border-b border-slate-50 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
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
            <select value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              {[10, 20, 50].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <DeleteModal isOpen={deleteModal.isOpen} user={deleteModal.user} deleting={deleting}
        onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />
      <ChangePasswordModal isOpen={changePasswordModal.isOpen} user={changePasswordModal.user}
        loading={changingPassword} onConfirm={handleChangePasswordConfirm} onClose={handleChangePasswordCancel} />
    </div>
  );
}

// ── Small helper ──────────────────────────────────────────────────────────────
const colorMap: Record<string, string> = {
  indigo: "text-indigo-600 hover:bg-indigo-50",
  emerald: "text-emerald-600 hover:bg-emerald-50",
  amber: "text-amber-600 hover:bg-amber-50",
  violet: "text-violet-600 hover:bg-violet-50",
  rose: "text-rose-600 hover:bg-rose-50",
};

function ActionBtn({ icon: Icon, color, title, onClick, disabled }: {
  icon: React.ElementType; color: string; title: string;
  onClick: () => void; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${colorMap[color]}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}
