'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel,
  flexRender, createColumnHelper, SortingState,
} from '@tanstack/react-table';
import {
  FileText, Users, UserCheck, Briefcase, Search,
  ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, BarChart2,
} from 'lucide-react';
import Image from 'next/image';
import { getUsers } from '@/lib/services/user/userService';
import { User } from '@/lib/types';
import EmployeeReportModal from '@/components/dashboard/reports/EmployeeReportModal';

type TabType = 'all' | 'employee' | 'supervisor';

const col = createColumnHelper<User>();

export default function ReportsContent() {
  const [users, setUsers]               = useState<User[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab]       = useState<TabType>('all');
  const [sorting, setSorting]           = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    getUsers().then((all) => {
      setUsers(all.filter((u) => u.accountType !== 'Admin'));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      getUsers().then((all) => setUsers(all.filter((u) => u.accountType !== 'Admin')));
    }
  }, [selectedUser]);

  const displayUsers = useMemo(() => {
    if (activeTab === 'employee')   return users.filter((u) => u.accountType === 'Employee');
    if (activeTab === 'supervisor') return users.filter((u) => u.accountType === 'Supervisor');
    return users;
  }, [users, activeTab]);

  const columns = useMemo(() => [
    col.accessor('numericId', {
      header: 'ID',
      cell: (i) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm">
          {i.getValue()}
        </span>
      ),
    }),
    col.accessor('name', {
      header: 'Employee',
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
              <p className="text-xs text-slate-400">{user.email || '—'}</p>
            </div>
          </div>
        );
      },
    }),
    col.accessor('department', {
      header: 'Department',
      cell: (i) => {
        const dept = i.getValue() || i.row.original.Department;
        return dept
          ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700">{dept}</span>
          : <span className="text-slate-400 text-sm">—</span>;
      },
    }),
    col.accessor('jobTitle', {
      header: 'Job Title',
      cell: (i) => <span className="text-sm text-slate-600">{i.getValue() || '—'}</span>,
    }),
    col.accessor('accountType', {
      header: 'Role',
      cell: (i) => {
        const v = i.getValue();
        const isSuper = v === 'Supervisor' || v === 'Manager';
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isSuper ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {isSuper ? <UserCheck className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
            {v}
          </span>
        );
      },
    }),
    col.accessor('status', {
      header: 'Status',
      cell: (i) => {
        const v = i.getValue() || 'Active';
        const cfg: Record<string, string> = {
          Active:   'bg-emerald-50 text-emerald-700',
          OnLeave:  'bg-amber-50 text-amber-700',
          Inactive: 'bg-rose-50 text-rose-700',
        };
        return (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg[v] ?? cfg.Active}`}>
            {v === 'OnLeave' ? 'On Leave' : v}
          </span>
        );
      },
    }),
    col.display({
      id: 'action',
      header: 'Report',
      cell: (i) => (
        <button
          onClick={() => setSelectedUser(i.row.original)}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          View
        </button>
      ),
    }),
  ], []);

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
    initialState: { pagination: { pageSize: 15 } },
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading reports…</p>
      </div>
    </div>
  );

  const empCount = users.filter((u) => u.accountType === 'Employee').length;
  const supCount = users.filter((u) => u.accountType === 'Supervisor').length;

  const tabs: { key: TabType; label: string; count: number; icon: React.ElementType }[] = [
    { key: 'all',        label: 'All Staff',   count: users.length, icon: Users      },
    { key: 'employee',   label: 'Employees',   count: empCount,     icon: Briefcase  },
    { key: 'supervisor', label: 'Supervisors', count: supCount,     icon: UserCheck  },
  ];

  const stats = [
    { label: 'Total Staff',   value: users.length, icon: Users,      color: 'bg-indigo-500' },
    { label: 'Employees',     value: empCount,      icon: Briefcase,  color: 'bg-sky-500'    },
    { label: 'Supervisors',   value: supCount,      icon: UserCheck,  color: 'bg-violet-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-6 space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">View and export attendance reports for all staff</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
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

        {/* Tabs + search toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-50 p-1 rounded-xl w-fit">
            {tabs.map(({ key, label, count, icon: Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === key
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}>
                <Icon className="w-4 h-4" />
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === key ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'
                }`}>{count}</span>
              </button>
            ))}
          </div>

          {/* Search + count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-xs text-slate-400">{table.getFilteredRowModel().rows.length} records</p>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search by name, email…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {table.getHeaderGroups()[0].headers.map((h) => (
                  <th key={h.id} onClick={h.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700 transition-colors whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && (
                        h.column.getIsSorted() === 'asc'  ? <ChevronUp   className="w-3 h-3 text-indigo-500" /> :
                        h.column.getIsSorted() === 'desc' ? <ChevronDown className="w-3 h-3 text-indigo-500" /> :
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
                  <td colSpan={columns.length} className="text-center py-16">
                    <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-medium">No staff found</p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <tr key={row.id}
                    className={`border-b border-slate-50 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
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
              {[15, 30, 50].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
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

      {selectedUser && (
        <EmployeeReportModal
          employee={{ ...selectedUser, numericId: selectedUser.numericId ?? '' }}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
