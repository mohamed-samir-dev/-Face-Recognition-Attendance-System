"use client";

import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLeaveDays } from "../hooks/useLeaveDays";
import { useWorkTimer } from "../hooks/useWorkTimer";
import { useOvertimeData } from "../hooks/useOvertimeData";
import { getMonthlyLateArrivals } from "@/lib/services/attendance/attendanceService";
import { getMonthlyAbsences } from "@/lib/services/attendance/absenceService";
import { getUserAttendanceHistory } from "@/lib/services/attendance/attendanceHistoryService";
import { AttendanceHistoryRecord } from "@/lib/types/attendanceHistory";
import { formatHoursForCard } from "@/lib/utils/timeFormatters";
import { getTeamMembers } from "@/lib/services/team/teamService";
import EmployeeReportModal from "./EmployeeReportModal";
import * as XLSX from 'xlsx';
import { LineChart, Line, BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TeamMember {
  id: string;
  name: string;
  numericId: string | number;
  jobTitle?: string;
}

export default function EmployeeReport() {
  const { user } = useAuth();
  const { leaveDays, vacationDays } = useLeaveDays(user?.numericId?.toString());
  const { totalHours } = useWorkTimer(user?.id);
  const { monthlyOvertime } = useOvertimeData(user?.id);
  const [lateArrivals, setLateArrivals] = useState<number>(0);
  const [absences, setAbsences] = useState<number>(0);
  const [records, setRecords] = useState<AttendanceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<TeamMember | null>(null);

  const isSupervisor = user?.accountType === 'Supervisor';

  const calculateAttendanceScore = () => {
    const DaysWorked = records.length;
    const Absences = absences;
    const TotalDays = DaysWorked + Absences;
    const LateArrivals = lateArrivals;
    const HoursWorked = totalHours;
    const ExpectedHours = 160;
    const OvertimeHours = monthlyOvertime;

    if (TotalDays === 0) return 100;

    const A = DaysWorked / TotalDays;
    const H = Math.min(1, HoursWorked / ExpectedHours);
    const P = Math.max(0, 1 - (LateArrivals / TotalDays));
    const O = OvertimeHours / ExpectedHours;

    const wA = 0.40;
    const wH = 0.30;
    const wP = 0.20;

    const BaseScore = wA * A + wH * H + wP * P;
    const OT_bonus_percent = (O * 100) * 0.5;
    const FinalScore_percent = BaseScore * 100 + OT_bonus_percent;

    return Math.round(FinalScore_percent * 10) / 10;
  };



  const overtimeChartData = () => {
    if (records.length === 0) return [];
    
    const dates = records.map(r => new Date(r.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    const allDays: { date: string; overtime: number }[] = [];
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayRecords = records.filter(r => r.date === dateStr);
      const overtime = dayRecords.reduce((sum, r) => sum + Math.max(0, (r.workedHours || 0) - 8), 0);
      allDays.push({ date: dateStr, overtime });
    }
    return allDays;
  };

  const weeklyChartData = () => {
    const grouped = records.reduce((acc, record) => {
      const date = new Date(record.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const weekLabel = `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;
      const existing = acc.find(item => item.week === weekLabel);
      if (existing) {
        existing.hours += record.workedHours || 0;
      } else {
        acc.push({ week: weekLabel, hours: record.workedHours || 0 });
      }
      return acc;
    }, [] as { week: string; hours: number }[]);
    return grouped;
  };

  useEffect(() => {
    if (user?.id) {
      getUserAttendanceHistory(user.id).then(data => {
        setRecords(data);
        setLoading(false);
      });
      getMonthlyLateArrivals(user.id).then(setLateArrivals);
      getMonthlyAbsences(user.id).then(setAbsences);
      if (user.accountType === 'Supervisor') {
        getTeamMembers(user.id).then(setTeamMembers);
      }
    }
  }, [user?.id, user?.accountType]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);
    let currentRow = 0;

    // Employee Information Section
    XLSX.utils.sheet_add_aoa(ws, [['EMPLOYEE INFORMATION']], { origin: `A${currentRow + 1}` });
    ws[`A${currentRow + 1}`].s = { font: { bold: true, sz: 14 }, fill: { fgColor: { rgb: "4472C4" } } };
    currentRow += 2;
    
    const employeeData = [
      ['Employee Name', user?.name || 'N/A', 'Employee ID', user?.numericId || 'N/A'],
      ['Email', user?.email || 'N/A', 'Phone', user?.phone || 'N/A'],
      ['Department', user?.department || user?.Department || 'N/A', 'Job Title', user?.jobTitle || 'N/A'],
      ['Account Type', user?.accountType || 'N/A', 'Status', user?.status || 'N/A']
    ];
    XLSX.utils.sheet_add_aoa(ws, employeeData, { origin: `A${currentRow + 1}` });
    currentRow += employeeData.length + 2;

    // Monthly Summary Section
    const attendanceScore = calculateAttendanceScore();
    
    XLSX.utils.sheet_add_aoa(ws, [['MONTHLY ATTENDANCE SUMMARY']], { origin: `A${currentRow + 1}` });
    currentRow += 2;
    
    const summaryData = [
      ['Total Hours Worked', formatHoursForCard(totalHours), 'Overtime Hours', formatHoursForCard(monthlyOvertime)],
      ['Regular Hours', formatHoursForCard(Math.max(0, totalHours - monthlyOvertime)), 'Expected Hours Progress', `${((totalHours / 160) * 100).toFixed(1)}%`],
      ['Late Arrivals', `${lateArrivals} days`, 'Monthly Absences', `${absences} days`],
      ['Total Days Worked', `${records.length} days`, 'Leave Days Taken', `${leaveDays} days`],
      ['Leave Days Remaining', `${vacationDays - leaveDays} days`, 'Total Leave Allowance', `${vacationDays} days`],
      ['Attendance Score', `${attendanceScore}%`, '', '']
    ];
    XLSX.utils.sheet_add_aoa(ws, summaryData, { origin: `A${currentRow + 1}` });
    currentRow += summaryData.length + 2;

    // Attendance History Section
    XLSX.utils.sheet_add_aoa(ws, [['DETAILED ATTENDANCE HISTORY']], { origin: `A${currentRow + 1}` });
    currentRow += 2;
    
    const headers = [['Date', 'Day', 'Check In', 'Check Out', 'Status', 'Late (min)', 'Hours Worked', 'Check-In Location', 'IP Location', 'Device Info', 'IP Address']];
    XLSX.utils.sheet_add_aoa(ws, headers, { origin: `A${currentRow + 1}` });
    currentRow += 1;
    
    const attendanceData = records.map(record => {
      const dayName = new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' });
      return [
        record.date,
        dayName,
        record.checkIn || 'N/A',
        record.checkOut || 'N/A',
        record.status,
        record.lateMinutes || 0,
        record.workedHours?.toFixed(2) || '0.00',
        record.checkInLocation || 'N/A',
        record.ipLocation || 'N/A',
        record.deviceInfo || 'N/A',
        record.ipAddress || 'N/A'
      ];
    });
    XLSX.utils.sheet_add_aoa(ws, attendanceData, { origin: `A${currentRow + 1}` });

    ws['!cols'] = [
      { width: 12 }, { width: 8 }, { width: 10 }, { width: 10 },
      { width: 10 }, { width: 10 }, { width: 12 }, { width: 35 },
      { width: 25 }, { width: 30 }, { width: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
    XLSX.writeFile(wb, `Attendance_Report_${user?.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Attendance Report</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Monthly overview and detailed history</p>
          </div>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>

        {/* Employee Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Employee Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Name</p>
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Employee ID</p>
              <p className="text-sm font-semibold text-gray-900">{user?.numericId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone</p>
              <p className="text-sm font-semibold text-gray-900">{user?.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Department</p>
              <p className="text-sm font-semibold text-gray-900">{user?.department || user?.Department || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Job Title</p>
              <p className="text-sm font-semibold text-gray-900">{user?.jobTitle || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Account Type</p>
              <p className="text-sm font-semibold text-gray-900">{user?.accountType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                user?.status === 'Active' ? 'bg-green-100 text-green-800' :
                user?.status === 'OnLeave' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {user?.status || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Monthly Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{formatHoursForCard(totalHours)}</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Total Hours</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{formatHoursForCard(monthlyOvertime)}</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Overtime</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">{((totalHours / 160) * 100).toFixed(1)}%</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Progress</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">{lateArrivals}</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Late Days</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">{absences}</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Absences</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-indigo-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-600">{records.length}</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Days Worked</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600">{leaveDays}</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Leave Taken</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-teal-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">{vacationDays - leaveDays}</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Leave Left</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-600">{formatHoursForCard(Math.max(0, totalHours - monthlyOvertime))}</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Regular Hours</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-cyan-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-600">{vacationDays}</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Total Leave</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-pink-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">160h</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Expected</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-emerald-50 rounded-lg">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">{calculateAttendanceScore()}%</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Score</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Line Chart - Hours Over Time */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Overtime Hours Over Time</h3>
            {records.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={overtimeChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} interval={0} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value: number | undefined) => `${(value || 0).toFixed(2)}h`}
                  />
                  <Line type="monotone" dataKey="overtime" stroke="#14b8a6" strokeWidth={2} dot={{ fill: '#14b8a6' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">No data available</div>
            )}
          </div>

          {/* Bar Chart - Weekly Hours */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Weekly Hours Distribution</h3>
            <p className="text-[10px] sm:text-xs text-gray-500 mb-3">Total hours worked per week</p>
            {records.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value: number | undefined) => `${(value || 0).toFixed(2)}h`}
                  />
                  <Bar dataKey="hours" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm px-4 text-center">No completed sessions yet. Check out to see data.</div>
            )}
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Attendance History</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{records.length} records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700">Date</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700">Day</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700">Check In</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700">Check Out</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700">Status</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700">Late</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700">Hours</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700">Location</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700">IP Location</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700">Device</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((record) => {
                  const dayName = new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">{record.date}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">{dayName}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-green-600 font-medium">{record.checkIn || 'N/A'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-600 font-medium">{record.checkOut || 'N/A'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        <span className={`px-2 py-1 rounded text-[10px] sm:text-xs font-medium ${
                          record.status === 'Present' ? 'bg-green-100 text-green-700' :
                          record.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                          record.status === 'OnLeave' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-orange-600 font-medium">{record.lateMinutes || 0} min</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-blue-600 font-medium">{record.workedHours?.toFixed(2) || '0.00'}h</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-600 max-w-[150px] sm:max-w-[200px] truncate" title={record.checkInLocation}>{record.checkInLocation || 'N/A'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-600 max-w-[120px] sm:max-w-[150px] truncate" title={record.ipLocation}>{record.ipLocation || 'N/A'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-600 max-w-[150px] sm:max-w-[180px] truncate" title={record.deviceInfo}>{record.deviceInfo || 'N/A'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-600 font-mono">{record.ipAddress || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Members - Only for Supervisors */}
        {isSupervisor && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Team Members</h2>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">View reports for your team</p>
            </div>
            <div className="divide-y divide-gray-200">
              {teamMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2 sm:mb-3" />
                  <p className="text-sm sm:text-base text-gray-500 font-medium">No team members found</p>
                </div>
              ) : (
                teamMembers.map((member) => (
                  <div key={member.id} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base shrink-0">
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{member.name}</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">{member.jobTitle || 'Employee'} • ID: {member.numericId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setSelectedEmployee(member)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-1 sm:flex-initial"
                      >
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                        View Report
                      </button>
                      <button
                        onClick={() => setTeamMembers(prev => prev.filter(m => m.id !== member.id))}
                        className="px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selectedEmployee && (
          <EmployeeReportModal
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
          />
        )}
      </div>
    </div>
  );
}