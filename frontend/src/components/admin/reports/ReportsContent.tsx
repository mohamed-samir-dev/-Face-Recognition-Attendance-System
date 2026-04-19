'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
type SortKey = 'numericId' | 'name' | 'department' | 'jobTitle' | 'accountType' | 'status';
type SortDir = 'asc' | 'desc' | null;

export default function ReportsContent() {
  const [users, setUsers]               = useState<User[]>([]);
  const [loading, setLoading]           = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab]       = useState<TabType>('all');
  const [sortKey, setSortKey]           = useState<SortKey | null>(null);
  const [sortDir, setSortDir]           = useState<SortDir>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageIndex, setPageIndex]       = useState(0);
  const [pageSize, setPageSize]         = useState(15);

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

  const filtered = useMemo(() => {
    if (!globalFilter) return displayUsers;
    const q = globalFilter.toLowerCase();
    return displayUsers.filter((u) =>
      (u.name?.toLowerCase().includes(q)) ||
      (u.email?.toLowerCase().includes(q)) ||
      (u.numericId?.toString().includes(q)) ||
      (u.department?.toLowerCase().includes(q)) ||
      ((u as unknown as Record<string, string>).Department)?.toLowerCase().includes(q)
    );
  }, [displayUsers, globalFilter]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";
      if (sortKey === "department") {
        av = a.department || (a as unknown as Record<string, string>).Department || "";
        bv = b.department || (b as unknown as Record<string, string>).Department || "";
      } else if (sortKey === "numericId") {
        av = Number(a.numericId) || 0;
        bv = Number(b.numericId) || 0;
      } else {
        av = (a[sortKey] as string) ?? "";
        bv = (b[sortKey] as string) ?? "";
      }
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

  const headers: { key: SortKey | null; label: string }[] = [
    { key: 'numericId', label: 'ID' },
    { key: 'name', label: 'Employee' },
    { key: 'department', label: 'Department' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'accountType', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: null, label: 'Report' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-6 space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">View and export attendance reports for all staff</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          <div className="flex gap-1 bg-slate-50 p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
            {tabs.map(({ key, label, count, icon: Icon }) => (
              <button key={key} onClick={() => { setActiveTab(key); setPageIndex(0); }}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-1 sm:flex-none justify-center ${
                  activeTab === key
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}>
                <Icon className="w-4 h-4 hidden sm:block" />
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === key ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'
                }`}>{count}</span>
              </button>
            ))}
          </div>

          {/* Search + count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-xs text-slate-400">{sorted.length} records</p>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={globalFilter} onChange={(e) => { setGlobalFilter(e.target.value); setPageIndex(0); }}
                placeholder="Search by name, email…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50" />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {headers.map((h) => (
                  <th key={h.label} onClick={() => h.key && toggleSort(h.key)}
                    className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700 transition-colors whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {h.label}
                      {h.key && (
                        sortKey === h.key && sortDir === 'asc'  ? <ChevronUp   className="w-3 h-3 text-indigo-500" /> :
                        sortKey === h.key && sortDir === 'desc' ? <ChevronDown className="w-3 h-3 text-indigo-500" /> :
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
                    <p className="text-slate-400 text-sm font-medium">No staff found</p>
                  </td>
                </tr>
              ) : (
                paged.map((user, i) => {
                  let src = user.image;
                  try {
                    const p = JSON.parse(user.image);
                    src = p.profileImage || (Array.isArray(p) ? p[0] : user.image);
                  } catch {}
                  const dept = user.department || (user as unknown as Record<string, string>).Department;
                  const role = user.accountType;
                  const isSuper = role === 'Supervisor' || role === 'Manager';
                  const st = user.status || 'Active';
                  const stCfg: Record<string, string> = {
                    Active:   'bg-emerald-50 text-emerald-700',
                    OnLeave:  'bg-amber-50 text-amber-700',
                    Inactive: 'bg-rose-50 text-rose-700',
                  };

                  return (
                    <tr key={user.id}
                      className={`border-b border-slate-50 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm">
                          {user.numericId}
                        </span>
                      </td>
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3">
                        {dept
                          ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700">{dept}</span>
                          : <span className="text-slate-400 text-sm">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-600">{user.jobTitle || '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isSuper ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isSuper ? <UserCheck className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                          {role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stCfg[st] ?? stCfg.Active}`}>
                          {st === 'OnLeave' ? 'On Leave' : st}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {paged.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">No staff found</p>
            </div>
          ) : (
            paged.map((user) => {
              let src = user.image;
              try {
                const p = JSON.parse(user.image);
                src = p.profileImage || (Array.isArray(p) ? p[0] : user.image);
              } catch {}
              const dept = user.department || (user as unknown as Record<string, string>).Department;
              const role = user.accountType;
              const isSuper = role === 'Supervisor' || role === 'Manager';
              const st = user.status || 'Active';
              const stCfg: Record<string, string> = {
                Active:   'bg-emerald-50 text-emerald-700',
                OnLeave:  'bg-amber-50 text-amber-700',
                Inactive: 'bg-rose-50 text-rose-700',
              };

              return (
                <div key={user.id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {src ? (
                      <Image src={src} alt={user.name} width={40} height={40}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0" unoptimized />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email || '—'}</p>
                    </div>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs shrink-0">
                      {user.numericId}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {dept && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700">{dept}</span>}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isSuper ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isSuper ? <UserCheck className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                      {role}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stCfg[st] ?? stCfg.Active}`}>
                      {st === 'OnLeave' ? 'On Leave' : st}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{user.jobTitle || '—'}</span>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      View Report
                    </button>
                  </div>
                </div>
              );
            })
          )}
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

      {selectedUser && (
        <EmployeeReportModal
          employee={{ ...selectedUser, numericId: selectedUser.numericId ?? '' }}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
