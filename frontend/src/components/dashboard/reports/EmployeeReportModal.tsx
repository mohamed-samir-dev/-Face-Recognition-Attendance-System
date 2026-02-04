"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { useLeaveDays } from "../hooks/useLeaveDays";
import { useWorkTimer } from "../hooks/useWorkTimer";
import { useOvertimeData } from "../hooks/useOvertimeData";
import { getMonthlyLateArrivals } from "@/lib/services/attendance/attendanceService";
import { getMonthlyAbsences } from "@/lib/services/attendance/absenceService";
import { getUserAttendanceHistory } from "@/lib/services/attendance/attendanceHistoryService";
import { AttendanceHistoryRecord } from "@/lib/types/attendanceHistory";
import { formatHoursForCard } from "@/lib/utils/timeFormatters";
import * as XLSX from 'xlsx';

interface EmployeeReportModalProps {
  employee: any;
  onClose: () => void;
}

export default function EmployeeReportModal({ employee, onClose }: EmployeeReportModalProps) {
  const { leaveDays, vacationDays } = useLeaveDays(employee?.numericId?.toString());
  const { totalHours } = useWorkTimer(employee?.id);
  const { monthlyOvertime } = useOvertimeData(employee?.id);
  const [lateArrivals, setLateArrivals] = useState<number>(0);
  const [absences, setAbsences] = useState<number>(0);
  const [records, setRecords] = useState<AttendanceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (employee?.id) {
      getUserAttendanceHistory(employee.id).then(data => {
        setRecords(data);
        setLoading(false);
      });
      getMonthlyLateArrivals(employee.id).then(setLateArrivals);
      getMonthlyAbsences(employee.id).then(setAbsences);
    }
  }, [employee?.id]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);
    let currentRow = 0;

    XLSX.utils.sheet_add_aoa(ws, [['EMPLOYEE INFORMATION']], { origin: `A${currentRow + 1}` });
    currentRow += 2;
    
    const employeeData = [
      ['Employee Name', employee?.name || 'N/A', 'Employee ID', employee?.numericId || 'N/A'],
      ['Email', employee?.email || 'N/A', 'Phone', employee?.phone || 'N/A'],
      ['Department', employee?.department || employee?.Department || 'N/A', 'Job Title', employee?.jobTitle || 'N/A'],
      ['Account Type', employee?.accountType || 'N/A', 'Status', employee?.status || 'N/A']
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

    XLSX.utils.book_append_sheet(wb, ws, 'Employee Report');
    XLSX.writeFile(wb, `Employee_Report_${employee?.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6">Loading...</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{employee?.name}'s Attendance Report</h2>
          <div className="flex gap-2">
            <button onClick={exportToExcel} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md mb-6 overflow-x-auto border border-blue-200">
            <div className="px-6 py-4 border-b border-blue-200 bg-white/50">
              <h3 className="text-lg font-bold text-blue-900">Employee Information</h3>
            </div>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-blue-100 bg-white/30">
                  <td className="px-6 py-3 text-sm font-semibold text-blue-900 w-1/4">Employee Name</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 w-1/4">{employee?.name}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-blue-900 w-1/4">Employee ID</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 w-1/4">{employee?.numericId}</td>
                </tr>
                <tr className="border-b border-blue-100 bg-white/50">
                  <td className="px-6 py-3 text-sm font-semibold text-blue-900">Email</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{employee?.email || 'N/A'}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-blue-900">Phone</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{employee?.phone || 'N/A'}</td>
                </tr>
                <tr className="border-b border-blue-100 bg-white/30">
                  <td className="px-6 py-3 text-sm font-semibold text-blue-900">Department</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{employee?.department || employee?.Department || 'N/A'}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-blue-900">Job Title</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{employee?.jobTitle || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md mb-6 overflow-x-auto border border-green-200">
            <div className="px-6 py-4 border-b border-green-200 bg-white/50">
              <h3 className="text-lg font-bold text-green-900">Monthly Attendance Summary</h3>
            </div>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-green-100 bg-white/30">
                  <td className="px-6 py-3 text-sm font-semibold text-green-900 w-1/4">Total Hours Worked</td>
                  <td className="px-6 py-3 text-sm font-bold text-blue-700 w-1/4">{formatHoursForCard(totalHours)}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-green-900 w-1/4">Overtime Hours</td>
                  <td className="px-6 py-3 text-sm font-bold text-green-700 w-1/4">{formatHoursForCard(monthlyOvertime)}</td>
                </tr>
                <tr className="border-b border-green-100 bg-white/50">
                  <td className="px-6 py-3 text-sm font-semibold text-green-900">Late Arrivals</td>
                  <td className="px-6 py-3 text-sm font-bold text-yellow-700">{lateArrivals} days</td>
                  <td className="px-6 py-3 text-sm font-semibold text-green-900">Monthly Absences</td>
                  <td className="px-6 py-3 text-sm font-bold text-red-700">{absences} days</td>
                </tr>
                <tr className="border-b border-green-100 bg-white/30">
                  <td className="px-6 py-3 text-sm font-semibold text-green-900">Total Days Worked</td>
                  <td className="px-6 py-3 text-sm font-bold text-blue-700">{records.length} days</td>
                  <td className="px-6 py-3 text-sm font-semibold text-green-900">Leave Days Taken</td>
                  <td className="px-6 py-3 text-sm font-bold text-orange-700">{leaveDays} days</td>
                </tr>
                <tr className="border-b border-green-100 bg-white/50">
                  <td className="px-6 py-3 text-sm font-semibold text-green-900">Attendance Score</td>
                  <td className="px-6 py-3 text-sm font-bold" colSpan={3}>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      (() => {
                        const score = calculateAttendanceScore();
                        return score >= 90 ? 'bg-green-200 text-green-900' : score >= 75 ? 'bg-yellow-200 text-yellow-900' : 'bg-red-200 text-red-900';
                      })()
                    }`}>
                      {calculateAttendanceScore()}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-200">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-lg font-bold text-purple-900">Detailed Attendance History</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Check In</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Check Out</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">{record.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-green-700">{record.checkIn || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-red-700">{record.checkOut || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800' :
                        record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                        record.status === 'OnLeave' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-blue-700">{record.workedHours?.toFixed(2) || '0.00'} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
