"use client";

import { useEffect, useState, useCallback } from "react";
import {Calendar, AlertCircle, CheckCircle, XCircle, Coffee, Filter } from "lucide-react";
import { AttendanceHistoryRecord } from "@/lib/types/attendanceHistory";
import { formatHoursForCard } from "@/lib/utils/timeFormatters";

interface AttendanceTableViewProps {
  fetchData: () => Promise<AttendanceHistoryRecord[]>;
  title: string;
  subtitle: string;
}

export default function AttendanceTableView({ fetchData, title, subtitle }: AttendanceTableViewProps) {
  const [history, setHistory] = useState<AttendanceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchData();
      setHistory(data);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const getStatusConfig = (status: string) => {
    const configs = {
      Present: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", badge: "bg-green-100 text-green-700 border-green-300" },
      Late: { icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700 border-orange-300" },
      OnLeave: { icon: Coffee, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700 border-blue-300" },
      Absent: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700 border-red-300" }
    };
    return configs[status as keyof typeof configs] || configs.Absent;
  };

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === yesterday.getTime()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateDuration = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return null;
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    const minutes = (outH * 60 + outM) - (inH * 60 + inM);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const groupByDate = (records: AttendanceHistoryRecord[]) => {
    const grouped: { [key: string]: AttendanceHistoryRecord[] } = {};
    records.forEach(record => {
      if (!grouped[record.date]) grouped[record.date] = [];
      grouped[record.date].push(record);
    });
    return grouped;
  };

  const getDateStats = (records: AttendanceHistoryRecord[]) => {
    return {
      present: records.filter(r => r.status === 'Present').length,
      late: records.filter(r => r.status === 'Late').length,
      onLeave: records.filter(r => r.status === 'OnLeave').length,
      absent: records.filter(r => r.status === 'Absent').length,
      total: records.length
    };
  };

  const filteredHistory = filterDate ? history.filter(record => record.date === filterDate) : history;
  const groupedHistory = groupByDate(filteredHistory);
  const sortedDates = Object.keys(groupedHistory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#667eea] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">{title}</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-lg border border-gray-200 shadow-sm w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="text-gray-700 text-sm border-0 focus:ring-0 focus:outline-none flex-1 sm:flex-initial"
          />
          {filterDate && (
            <button onClick={() => setFilterDate("")} className="text-xs text-[#667eea] hover:text-[#764ba2] font-semibold whitespace-nowrap">
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 sm:p-16 text-center shadow-sm">
          <Calendar className="w-16 sm:w-20 h-16 sm:h-20 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Records Found</h3>
          <p className="text-sm sm:text-base text-gray-400">No attendance records available for the selected date.</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {sortedDates.map((date) => {
            const records = groupedHistory[date];
            const stats = getDateStats(records);
            
            return (
              <div key={date} className="space-y-3 sm:space-y-4">
                {/* Date Header with Stats */}
                <div className="bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-lg p-3 sm:p-4 shadow-md">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                        <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-white">{getDayLabel(date)}</h2>
                        <p className="text-white/80 text-xs sm:text-sm">{stats.total} team members</p>
                      </div>
                    </div>
                    <div className="flex gap-3 sm:gap-6 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                      <div className="text-center min-w-[60px]">
                        <div className="flex items-center gap-1 sm:gap-1.5 text-white/90 mb-1 justify-center">
                          <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="text-xs font-medium">Present</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-white">{stats.present}</p>
                      </div>
                      <div className="text-center min-w-[60px]">
                        <div className="flex items-center gap-1 sm:gap-1.5 text-white/90 mb-1 justify-center">
                          <AlertCircle className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="text-xs font-medium">Late</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-white">{stats.late}</p>
                      </div>
                      <div className="text-center min-w-[60px]">
                        <div className="flex items-center gap-1 sm:gap-1.5 text-white/90 mb-1 justify-center">
                          <Coffee className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="text-xs font-medium">Leave</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-white">{stats.onLeave}</p>
                      </div>
                      <div className="text-center min-w-[60px]">
                        <div className="flex items-center gap-1 sm:gap-1.5 text-white/90 mb-1 justify-center">
                          <XCircle className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="text-xs font-medium">Absent</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-white">{stats.absent}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Records Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Employee</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Status</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">ID</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Job Title</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Department</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Check In</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Check Out</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Duration</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Worked Hours</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Late</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Location Address</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Coordinates</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Accuracy</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Geofence Status</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Main Office</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Branch Office</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">IP Address</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Device</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Browser</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Screen</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Timezone</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {records.map((record) => {
                          console.log('Rendering record:', record);
                          const statusConfig = getStatusConfig(record.status);
                          const StatusIcon = statusConfig.icon;
                          const duration = calculateDuration(record.checkIn, record.checkOut);
                          
                          return (
                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className={`${statusConfig.bg} p-1 sm:p-1.5 rounded`}>
                                    <StatusIcon className={`w-3 sm:w-4 h-3 sm:h-4 ${statusConfig.color}`} />
                                  </div>
                                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">{record.employeeName}</span>
                                </div>
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                                <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${statusConfig.badge}`}>
                                  {record.status}
                                </span>
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{record.numericId || '-'}</td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{record.jobTitle || '-'}</td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{record.department || '-'}</td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-blue-600 whitespace-nowrap">{formatTime(record.checkIn)}</td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-purple-600 whitespace-nowrap">{record.checkOut ? formatTime(record.checkOut) : '-'}</td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-green-600 whitespace-nowrap">{duration || '-'}</td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-emerald-600 whitespace-nowrap">
                                {record.workedHours !== undefined && record.workedHours > 0 ? formatHoursForCard(record.workedHours) : '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-orange-600 whitespace-nowrap">
                                {record.isLate && record.lateMinutes ? `${Math.round(record.lateMinutes)} min` : '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 max-w-xs truncate" title={record.locationAddress}>
                                {record.locationAddress || '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap">
                                {record.coordinates ? (
                                  <a
                                    href={`https://www.google.com/maps?q=${record.coordinates}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {record.coordinates}
                                  </a>
                                ) : '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                                {record.accuracy ? `${Math.round(record.accuracy)}m` : '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                                {record.geofenceStatus ? (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    record.geofenceStatus === 'Inside' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {record.geofenceStatus}
                                  </span>
                                ) : '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap">
                                {record.mainOffice ? (
                                  <span className={`font-medium ${
                                    record.mainOffice.includes('✓') 
                                      ? 'text-green-600' 
                                      : 'text-red-600'
                                  }`}>
                                    {record.mainOffice}
                                  </span>
                                ) : '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap">
                                {record.branchOffice ? (
                                  <span className={`font-medium ${
                                    record.branchOffice.includes('✓') 
                                      ? 'text-green-600' 
                                      : 'text-red-600'
                                  }`}>
                                    {record.branchOffice}
                                  </span>
                                ) : '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                                {record.ipAddress || '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                                {record.deviceInfo || '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 max-w-xs truncate" title={record.browser}>
                                {record.browser || '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                                {record.screen || '-'}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                                {record.timezone || '-'}
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
          })}
        </div>
      )}
    </div>
  );
}
