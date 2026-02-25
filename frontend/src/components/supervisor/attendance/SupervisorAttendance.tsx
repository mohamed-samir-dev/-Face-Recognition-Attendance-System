"use client";

import { useEffect, useState, useCallback } from "react";
import {Calendar, AlertCircle, CheckCircle, XCircle, Coffee, Filter } from "lucide-react";
import { User as UserType } from "@/lib/types";
import { getSupervisorTeamAttendance } from "@/lib/services/attendance/supervisorAttendanceService";
import { AttendanceHistoryRecord } from "@/lib/types/attendanceHistory";
import { formatHoursForCard } from "@/lib/utils/timeFormatters";

interface SupervisorAttendanceProps {
  user: UserType;
}

export default function SupervisorAttendance({ user }: SupervisorAttendanceProps) {
  const [history, setHistory] = useState<AttendanceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      const teamHistory = await getSupervisorTeamAttendance(user.id);
      setHistory(teamHistory);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
          <p className="text-gray-600 text-sm mt-1">Complete attendance history and details</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-300">
          <Filter className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="text-gray-900 text-sm border-0 focus:ring-0 focus:outline-none"
          />
          {filterDate && (
            <button onClick={() => setFilterDate("")} className="text-xs text-[#667eea] hover:text-[#764ba2] font-medium">
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No Records Found</h3>
          <p className="text-gray-500 text-sm">No attendance records available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const records = groupedHistory[date];
            const stats = getDateStats(records);
            
            return (
              <div key={date} className="space-y-3">
                <div className="bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-lg p-4 shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-white" />
                      <div>
                        <h2 className="text-lg font-bold text-white">{getDayLabel(date)}</h2>
                        <p className="text-white/80 text-xs">{stats.total} employees</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-3 text-white text-sm">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>{stats.present} Present</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{stats.late} Late</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Coffee className="w-4 h-4" />
                          <span>{stats.onLeave} Leave</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          <span>{stats.absent} Absent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {records.map((record) => {
                    const statusConfig = getStatusConfig(record.status);
                    const StatusIcon = statusConfig.icon;
                    const duration = calculateDuration(record.checkIn, record.checkOut);
                    
                    return (
                      <div key={record.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-bold text-gray-900">{record.employeeName}</h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.badge}`}>
                                    {record.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  {record.numericId && <span className="font-semibold">ID: {record.numericId}</span>}
                                  {record.jobTitle && <span className="font-medium">{record.jobTitle}</span>}
                                  {record.department && <span className="font-medium">{record.department}</span>}
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-500">{new Date(record.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                          
                            {record.accountType && (
                              <span className="bg-indigo-100 rounded-md px-3 py-1.5 text-xs">
                                <span className="text-indigo-700">Account:</span> <span className="font-semibold text-indigo-900">{record.accountType}</span>
                              </span>
                            )}
                          
                            {record.checkInLocation && (
                              <span className="bg-blue-100 rounded-md px-3 py-1.5 text-xs">
                                <span className="text-blue-700">Check-in Location:</span> <span className="font-semibold text-blue-900">{record.checkInLocation}</span>
                              </span>
                            )}
                            {record.deviceInfo && (
                              <span className="bg-gray-100 rounded-md px-3 py-1.5 text-xs">
                                <span className="text-gray-600">Device Used:</span> <span className="font-semibold text-gray-900">{record.deviceInfo}</span>
                              </span>
                            )}
                            {record.ipAddress && (
                              <span className="bg-gray-100 rounded-md px-3 py-1.5 text-xs">
                                <span className="text-gray-600">IP Address:</span> <span className="font-semibold text-gray-900">{record.ipAddress}</span>
                              </span>
                            )}
                            {record.ipLocation && (
                              <span className="bg-gray-100 rounded-md px-3 py-1.5 text-xs">
                                <span className="text-gray-600">IP Location:</span> <span className="font-semibold text-gray-900">{record.ipLocation}</span>
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            <div className="bg-gray-50 rounded-md px-3 py-2">
                              <p className="text-xs font-medium text-gray-600 mb-1">Check-in Time</p>
                              <p className="text-sm font-bold text-gray-900">{formatTime(record.checkIn)}</p>
                            </div>
                            
                            {record.checkOut && (
                              <div className="bg-gray-50 rounded-md px-3 py-2">
                                <p className="text-xs font-medium text-gray-600 mb-1">Check-out Time</p>
                                <p className="text-sm font-bold text-gray-900">{formatTime(record.checkOut)}</p>
                              </div>
                            )}

                            {duration && (
                              <div className="bg-gray-50 rounded-md px-3 py-2">
                                <p className="text-xs font-medium text-gray-600 mb-1">Total Duration</p>
                                <p className="text-sm font-bold text-gray-900">{duration}</p>
                              </div>
                            )}
                            
                            {record.isLate && record.lateMinutes ? (
                              <div className="bg-orange-50 rounded-md px-3 py-2">
                                <p className="text-xs font-medium text-orange-700 mb-1">Late Arrival</p>
                                <p className="text-sm font-bold text-orange-900">{Math.round(record.lateMinutes)} minutes</p>
                              </div>
                            ) : null}
                            
                            {record.wasOnLeave && (
                              <div className="bg-blue-50 rounded-md px-3 py-2">
                                <p className="text-xs font-medium text-blue-700 mb-1">Leave Reason</p>
                                <p className="text-xs font-bold text-blue-900">{record.leaveReason || 'N/A'}</p>
                              </div>
                            )}
                            
                            {record.workedHours !== undefined && record.workedHours > 0 && (
                              <div className="bg-green-50 rounded-md px-3 py-2">
                                <p className="text-xs font-medium text-green-700 mb-1">Hours Worked</p>
                                <p className="text-sm font-bold text-green-900">{formatHoursForCard(record.workedHours)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
