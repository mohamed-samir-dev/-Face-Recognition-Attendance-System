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

interface TeamMember {
  id: string;
  name: string;
  numericId: string | number;
  jobTitle?: string;
}

export default function SupervisorReport() {
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

  useEffect(() => {
    if (user?.id) {
      getUserAttendanceHistory(user.id).then(data => {
        setRecords(data);
        setLoading(false);
      });
      getMonthlyLateArrivals(user.id).then(setLateArrivals);
      getMonthlyAbsences(user.id).then(setAbsences);
      getTeamMembers(user.id).then(setTeamMembers);
    }
  }, [user?.id]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);
    let currentRow = 0;

    XLSX.utils.sheet_add_aoa(ws, [['SUPERVISOR INFORMATION']], { origin: `A${currentRow + 1}` });
    ws[`A${currentRow + 1}`].s = { font: { bold: true, sz: 14 }, fill: { fgColor: { rgb: "4472C4" } } };
    currentRow += 2;
    
    const employeeData = [
      ['Supervisor Name', user?.name || 'N/A', 'Employee ID', user?.numericId || 'N/A'],
      ['Email', user?.email || 'N/A', 'Phone', user?.phone || 'N/A'],
      ['Department', user?.department || user?.Department || 'N/A', 'Job Title', user?.jobTitle || 'N/A'],
      ['Account Type', user?.accountType || 'N/A', 'Status', user?.status || 'N/A']
    ];
    XLSX.utils.sheet_add_aoa(ws, employeeData, { origin: `A${currentRow + 1}` });
    currentRow += employeeData.length + 2;

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

    XLSX.utils.book_append_sheet(wb, ws, 'Supervisor Report');
    XLSX.writeFile(wb, `Supervisor_Report_${user?.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Attendance Report</h1>
            <p className="text-sm text-gray-500 mt-1">Supervisor monthly overview</p>
          </div>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>

        {/* Supervisor Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Supervisor Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                'bg-gray-100 text-gray-800'
              }`}>
                {user?.status || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{formatHoursForCard(totalHours)}</p>
              <p className="text-xs text-gray-600 mt-1">Total Hours</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{formatHoursForCard(monthlyOvertime)}</p>
              <p className="text-xs text-gray-600 mt-1">Overtime</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{((totalHours / 160) * 100).toFixed(1)}%</p>
              <p className="text-xs text-gray-600 mt-1">Progress</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{lateArrivals}</p>
              <p className="text-xs text-gray-600 mt-1">Late Days</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{absences}</p>
              <p className="text-xs text-gray-600 mt-1">Absences</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{records.length}</p>
              <p className="text-xs text-gray-600 mt-1">Days Worked</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{leaveDays}</p>
              <p className="text-xs text-gray-600 mt-1">Leave Taken</p>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <p className="text-2xl font-bold text-teal-600">{vacationDays - leaveDays}</p>
              <p className="text-xs text-gray-600 mt-1">Leave Left</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">{formatHoursForCard(Math.max(0, totalHours - monthlyOvertime))}</p>
              <p className="text-xs text-gray-600 mt-1">Regular Hours</p>
            </div>
            <div className="text-center p-4 bg-cyan-50 rounded-lg">
              <p className="text-2xl font-bold text-cyan-600">{vacationDays}</p>
              <p className="text-xs text-gray-600 mt-1">Total Leave</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">160h</p>
              <p className="text-xs text-gray-600 mt-1">Expected</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">{calculateAttendanceScore()}%</p>
              <p className="text-xs text-gray-600 mt-1">Score</p>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Attendance History</h2>
            <p className="text-xs text-gray-500 mt-1">{records.length} records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Day</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Check In</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Check Out</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Late</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">IP Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((record) => {
                  const dayName = new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{dayName}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{record.checkIn || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium">{record.checkOut || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          record.status === 'Present' ? 'bg-green-100 text-green-700' :
                          record.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                          record.status === 'OnLeave' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-orange-600 font-medium">{record.lateMinutes || 0} min</td>
                      <td className="px-4 py-3 text-sm text-blue-600 font-medium">{record.workedHours?.toFixed(2) || '0.00'}h</td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate" title={record.checkInLocation}>{record.checkInLocation || 'N/A'}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[150px] truncate" title={record.ipLocation}>{record.ipLocation || 'N/A'}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate" title={record.deviceInfo}>{record.deviceInfo || 'N/A'}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 font-mono">{record.ipAddress || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
            <p className="text-xs text-gray-500 mt-1">View reports for your team</p>
          </div>
          <div className="divide-y divide-gray-200">
            {teamMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No team members found</p>
              </div>
            ) : (
              teamMembers.map((member) => (
                <div key={member.id} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-xs text-gray-500">{member.jobTitle || 'Employee'} • ID: {member.numericId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedEmployee(member)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      View Report
                    </button>
                    <button
                      onClick={() => setTeamMembers(prev => prev.filter(m => m.id !== member.id))}
                      className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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
