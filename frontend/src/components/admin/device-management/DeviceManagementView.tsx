"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { resetDeviceBinding } from "@/lib/services/auth/sessionService";
import { Smartphone, SmartphoneNfc, User, Building2, Search, ShieldOff } from "lucide-react";
import toast from "react-hot-toast";

interface EmployeeDevice {
  id: string;
  name: string;
  department?: string;
  position?: string;
  jobTitle?: string;
  image?: string;
  deviceFingerprint?: string | null;
  accountType?: string;
}

export default function DeviceManagementView() {
  const [employees, setEmployees] = useState<EmployeeDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "users"));
    const data = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() } as EmployeeDevice))
      .filter((u) => u.accountType !== "Admin");
    setEmployees(data);
    setLoading(false);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleReset = async (emp: EmployeeDevice) => {
    setResetting(emp.id);
    try {
      await resetDeviceBinding(emp.id);
      toast.success(`Device reset for ${emp.name}`);
      setEmployees((prev) =>
        prev.map((e) => e.id === emp.id ? { ...e, deviceFingerprint: null } : e)
      );
    } catch {
      toast.error("Failed to reset device");
    } finally {
      setResetting(null);
    }
  };

  const filtered = employees.filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.department?.toLowerCase().includes(search.toLowerCase())
  );

  const bound = filtered.filter((e) => e.deviceFingerprint);
  const unbound = filtered.filter((e) => !e.deviceFingerprint);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            Device Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage employee device bindings for single-device security
          </p>
        </div>

        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none bg-blue-50 border border-blue-100 rounded-xl px-3 sm:px-4 py-2 text-center">
            <p className="text-base sm:text-lg font-bold text-blue-600">{employees.length}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="flex-1 sm:flex-none bg-green-50 border border-green-100 rounded-xl px-3 sm:px-4 py-2 text-center">
            <p className="text-base sm:text-lg font-bold text-green-600">{employees.filter(e => e.deviceFingerprint).length}</p>
            <p className="text-xs text-gray-500">Bound</p>
          </div>
          <div className="flex-1 sm:flex-none bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 text-center">
            <p className="text-base sm:text-lg font-bold text-gray-500">{employees.filter(e => !e.deviceFingerprint).length}</p>
            <p className="text-xs text-gray-500">Unbound</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
      </div>

      {/* Bound */}
      {bound.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <SmartphoneNfc className="w-4 h-4 text-blue-500" />
            Device Bound ({bound.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {bound.map((emp) => (
              <EmployeeCard key={emp.id} emp={emp} bound resetting={resetting === emp.id} onReset={handleReset} />
            ))}
          </div>
        </div>
      )}

      {/* Unbound */}
      {unbound.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-gray-400" />
            No Device Bound ({unbound.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {unbound.map((emp) => (
              <EmployeeCard key={emp.id} emp={emp} bound={false} resetting={resetting === emp.id} onReset={handleReset} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Smartphone className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No employees found</p>
        </div>
      )}
    </div>
  );
}

function EmployeeCard({ emp, bound, resetting, onReset }: {
  emp: EmployeeDevice;
  bound: boolean;
  resetting: boolean;
  onReset: (emp: EmployeeDevice) => void;
}) {
  return (
    <div className={`bg-white rounded-2xl border p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-sm ${bound ? "border-blue-100" : "border-gray-100"}`}>
      {emp.image ? (
        <img src={emp.image} alt={emp.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 ring-2 ring-gray-100" />
      ) : (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{emp.name}</p>
        {emp.department && (
          <div className="flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500 truncate">{emp.department}</span>
          </div>
        )}
        <span className={`inline-flex items-center gap-1 mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
          bound ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${bound ? "bg-blue-500" : "bg-gray-300"}`} />
          {bound ? "Device bound" : "No device"}
        </span>
      </div>

      {bound && (
        <button
          onClick={() => onReset(emp)}
          disabled={resetting}
          className="shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer border border-red-100"
        >
          <ShieldOff className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">{resetting ? "..." : "Reset"}</span>
          {resetting && <span className="xs:hidden sm:hidden">...</span>}
          {!resetting && <span className="xs:hidden">Reset</span>}
        </button>
      )}
    </div>
  );
}
