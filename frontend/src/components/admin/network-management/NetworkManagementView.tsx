"use client";

import { useState, useEffect } from "react";
import { Wifi, Plus, Trash2, Globe, Search, Shield, Loader2, Power } from "lucide-react";
import toast from "react-hot-toast";
import {
  AllowedNetwork,
  getAllowedNetworks,
  addAllowedNetwork,
  removeAllowedNetwork,
  toggleNetworkEnabled,
} from "@/lib/services/system/networkService";

export default function NetworkManagementView() {
  const [networks, setNetworks] = useState<AllowedNetwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [ip, setIp] = useState("");
  const [label, setLabel] = useState("");
  const [search, setSearch] = useState("");
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [fetchingIp, setFetchingIp] = useState(false);

  const fetchNetworks = async () => {
    setLoading(true);
    try {
      const data = await getAllowedNetworks();
      setNetworks(data);
    } catch {
      toast.error("Failed to load networks");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentIp = async () => {
    setFetchingIp(true);
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setCurrentIp(data.ip);
    } catch {
      setCurrentIp(null);
    } finally {
      setFetchingIp(false);
    }
  };

  useEffect(() => {
    fetchNetworks();
    fetchCurrentIp();
  }, []);

  const handleAdd = async () => {
    if (!ip.trim()) {
      toast.error("Please enter an IP address");
      return;
    }
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip.trim())) {
      toast.error("Please enter a valid IP address (e.g. 192.168.1.1)");
      return;
    }
    if (networks.some((n) => n.ip === ip.trim())) {
      toast.error("This IP is already in the allowed list");
      return;
    }

    setAdding(true);
    try {
      await addAllowedNetwork(ip.trim(), label.trim() || "Unnamed Network");
      toast.success(`Network ${ip.trim()} added successfully`);
      setIp("");
      setLabel("");
      await fetchNetworks();
    } catch {
      toast.error("Failed to add network");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (network: AllowedNetwork) => {
    setRemoving(network.id);
    try {
      await removeAllowedNetwork(network.id);
      toast.success(`Network ${network.ip} removed`);
      setNetworks((prev) => prev.filter((n) => n.id !== network.id));
    } catch {
      toast.error("Failed to remove network");
    } finally {
      setRemoving(null);
    }
  };

  const handleToggle = async (network: AllowedNetwork) => {
    setToggling(network.id);
    try {
      const newState = !(network.enabled !== false);
      await toggleNetworkEnabled(network.id, newState);
      setNetworks((prev) =>
        prev.map((n) => (n.id === network.id ? { ...n, enabled: newState } : n))
      );
      toast.success(`${network.ip} ${newState ? "enabled" : "disabled"}`);
    } catch {
      toast.error("Failed to update network status");
    } finally {
      setToggling(null);
    }
  };

  const useCurrentIp = () => {
    if (currentIp) {
      setIp(currentIp);
      setLabel("Current Network");
    }
  };

  const filtered = networks.filter(
    (n) =>
      n.ip.includes(search) ||
      n.label.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Network Access Control
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Only employees connected to allowed networks can log in
          </p>
        </div>

        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none bg-indigo-50 border border-indigo-100 rounded-xl px-3 sm:px-4 py-2 text-center">
            <p className="text-base sm:text-lg font-bold text-indigo-600">
              {networks.length}
            </p>
            <p className="text-xs text-gray-500">Allowed</p>
          </div>
          <div className="flex-1 sm:flex-none bg-green-50 border border-green-100 rounded-xl px-3 sm:px-4 py-2 text-center">
            <p className="text-base sm:text-lg font-bold text-green-600">
              {networks.length === 0
                ? "Open"
                : currentIp && networks.some((n) => n.ip === currentIp)
                ? "Active"
                : "Restricted"}
            </p>
            <p className="text-xs text-gray-500">Status</p>
          </div>
        </div>
      </div>

      {/* Current IP info */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <Globe className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Your Current Public IP
            </p>
            {fetchingIp ? (
              <div className="flex items-center gap-2 mt-0.5">
                <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                <span className="text-sm text-gray-400">Detecting...</span>
              </div>
            ) : (
              <p className="text-lg font-bold text-gray-900 font-mono">
                {currentIp || "Unable to detect"}
              </p>
            )}
          </div>
        </div>
        {currentIp && !networks.some((n) => n.ip === currentIp) && (
          <button
            onClick={useCurrentIp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add This IP
          </button>
        )}
        {currentIp && networks.some((n) => n.ip === currentIp) && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            This network is allowed
          </span>
        )}
      </div>

      {/* Add form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-500" />
          Add Allowed Network
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">
              IP Address
            </label>
            <input
              type="text"
              placeholder="e.g. 203.0.113.50"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">
              Label (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Main Office WiFi"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAdd}
              disabled={adding || !ip.trim()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add
            </button>
          </div>
        </div>

        {networks.length === 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mt-2">
            <p className="text-xs text-amber-700">
              <span className="font-semibold">⚠️ No networks configured.</span>{" "}
              Login is currently allowed from any network. Add at least one IP to
              enable network restriction.
            </p>
          </div>
        )}
      </div>

      {/* Search */}
      {networks.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by IP or label..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
      )}

      {/* Network list */}
      {filtered.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <Wifi className="w-4 h-4 text-indigo-500" />
            Allowed Networks ({filtered.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((network) => (
              <div
                key={network.id}
                className={`bg-white rounded-2xl border p-4 flex items-center gap-3 shadow-sm ${
                  network.enabled === false
                    ? "border-gray-200 opacity-60"
                    : "border-gray-100"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  network.enabled === false ? "bg-gray-100" : "bg-indigo-50"
                }`}>
                  <Wifi className={`w-5 h-5 ${
                    network.enabled === false ? "text-gray-400" : "text-indigo-500"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {network.label}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {network.ip}
                  </p>
                  {network.addedAt && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Added{" "}
                      {new Date(network.addedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                {currentIp === network.ip && (
                  <span className="shrink-0 w-2 h-2 rounded-full bg-green-500" title="You are on this network" />
                )}
                {network.enabled === false && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                    Disabled
                  </span>
                )}
                <button
                  onClick={() => handleToggle(network)}
                  disabled={toggling === network.id}
                  className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer border ${
                    network.enabled !== false
                      ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100 border-green-100"
                  }`}
                >
                  {toggling === network.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Power className="w-3.5 h-3.5" />
                  )}
                  {network.enabled !== false ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleRemove(network)}
                  disabled={removing === network.id}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer border border-red-100"
                >
                  {removing === network.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {networks.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Wifi className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No networks match your search</p>
        </div>
      )}
    </div>
  );
}
