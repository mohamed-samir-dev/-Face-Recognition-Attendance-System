"use client";

import { useEffect, useState } from "react";
import { Monitor, CheckCircle, Clock, MapPin, Globe, User, AlertCircle, RefreshCw } from "lucide-react";
import { getAllMonitoringAlerts, MonitoringAlert } from "@/lib/services/system/monitoringService";
import { getUsers } from "@/lib/services/user/userService";
import { User as UserType } from "@/lib/types";
import { COMPANY_LOCATIONS } from "@/lib/constants/locations";
import { UAParser } from "ua-parser-js";

export default function MonitoringTab() {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "acknowledged" | "pending">("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [alertsData, usersData] = await Promise.all([
        getAllMonitoringAlerts(),
        getUsers()
      ]);
      setAlerts(alertsData.sort((a: MonitoringAlert, b: MonitoringAlert) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading monitoring data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = (employeeId: string) => {
    return users.find(u => u.numericId?.toString() === employeeId);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "acknowledged") return alert.acknowledged;
    if (filter === "pending") return !alert.acknowledged;
    return true;
  });

  const stats = {
    total: alerts.length,
    acknowledged: alerts.filter(a => a.acknowledged).length,
    pending: alerts.filter(a => !a.acknowledged).length,
    responseRate: alerts.length > 0 ? ((alerts.filter(a => a.acknowledged).length / alerts.length) * 100).toFixed(1) : "0"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Monitor className="w-7 h-7 text-blue-600" />
            Monitoring Tracking
          </h2>
          <p className="text-gray-600 text-sm mt-1">Track employee monitoring alerts and responses</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <Monitor className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Acknowledged</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.acknowledged}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Pending</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.pending}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">Response Rate</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.responseRate}%</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex gap-0 border-b border-gray-200">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              filter === "all"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter("acknowledged")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              filter === "acknowledged"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Acknowledged ({stats.acknowledged})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              filter === "pending"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Pending ({stats.pending})
          </button>
        </div>

        <div className="overflow-x-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No monitoring alerts found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Sent At</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Responded At</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Response Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Location Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Coordinates</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Accuracy</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Geofence Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Main Office</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Branch Office</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">IP Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Browser</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Screen</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Timezone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAlerts.map((alert) => {
                  const user = getUserInfo(alert.employeeId);
                  const responseTime = alert.acknowledgedAt
                    ? Math.floor((new Date(alert.acknowledgedAt).getTime() - new Date(alert.timestamp).getTime()) / 1000)
                    : null;
                  
                  const parser = new UAParser(alert.deviceInfo?.userAgent || '');
                  const device = parser.getDevice();
                  const browser = parser.getBrowser();
                  const os = parser.getOS();

                  return (
                    <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          alert.acknowledged
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {alert.acknowledged ? (
                            <><CheckCircle className="w-3 h-3" /> Ack</>
                          ) : (
                            <><Clock className="w-3 h-3" /> Pending</>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-500">ID: {alert.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user?.department || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {new Date(alert.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {alert.acknowledgedAt ? new Date(alert.acknowledgedAt).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {responseTime !== null ? `${responseTime}s` : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs" title={alert.location?.address}>
                        {alert.location?.address ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="truncate">{alert.location.address}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {alert.location?.latitude !== undefined && alert.location?.longitude !== undefined ? (
                          <a
                            href={`https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline whitespace-nowrap"
                          >
                            {alert.location.latitude.toFixed(6)}, {alert.location.longitude.toFixed(6)}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {alert.location?.accuracy ? `${Math.round(alert.location.accuracy)}m` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {alert.location?.isWithinGeofence !== undefined ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            alert.location.isWithinGeofence
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {alert.location.isWithinGeofence ? "✓ Inside" : "✗ Outside"}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {alert.location?.allDistances?.[0] ? (
                          <div className="text-sm">
                            <span className={`font-medium ${alert.location.allDistances[0].isWithin ? "text-green-600" : "text-orange-600"}`}>
                              {Math.round(alert.location.allDistances[0].distance)}m
                            </span>
                            <span className={`ml-1 ${alert.location.allDistances[0].isWithin ? "text-green-600" : "text-gray-400"}`}>
                              {alert.location.allDistances[0].isWithin ? "✓" : ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {alert.location?.allDistances?.[1] ? (
                          <div className="text-sm">
                            <span className={`font-medium ${alert.location.allDistances[1].isWithin ? "text-green-600" : "text-orange-600"}`}>
                              {Math.round(alert.location.allDistances[1].distance)}m
                            </span>
                            <span className={`ml-1 ${alert.location.allDistances[1].isWithin ? "text-green-600" : "text-gray-400"}`}>
                              {alert.location.allDistances[1].isWithin ? "✓" : ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {alert.ipAddress ? (
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3 text-gray-400" />
                            {alert.ipAddress}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {device.vendor || device.model || os.name ? (
                          <div>
                            <div className="font-medium">{device.vendor || device.model || os.name}</div>
                            {device.type && <div className="text-xs text-gray-500">{device.type}</div>}
                          </div>
                        ) : (
                          alert.deviceInfo?.platform || "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {browser.name ? (
                          <div>
                            <div className="font-medium">{browser.name}</div>
                            {browser.version && <div className="text-xs text-gray-500">v{browser.version}</div>}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {alert.deviceInfo?.screenResolution || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {alert.deviceInfo?.timezone || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
