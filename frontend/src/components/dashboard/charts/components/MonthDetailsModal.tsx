"use client";

import { X, Calendar, CheckCircle2, XCircle, Clock, TrendingUp, BarChart3 } from "lucide-react";

interface MonthDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthData: {
    month: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    attendanceRate: number;
  } | null;
}

export default function MonthDetailsModal({ isOpen, onClose, monthData }: MonthDetailsModalProps) {
  if (!isOpen || !monthData) return null;

  const onTimeDays = monthData.presentDays - monthData.lateDays;
  const workingDaysPercentage = ((monthData.presentDays / monthData.totalDays) * 100).toFixed(1);
  const latePercentage = ((monthData.lateDays / monthData.totalDays) * 100).toFixed(1);
  const absentPercentage = ((monthData.absentDays / monthData.totalDays) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-1">{monthData.month}</h3>
              <p className="text-blue-100 text-sm">Detailed Attendance Report</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <span className="text-sm font-medium text-blue-700">Attendance Rate</span>
              </div>
              <div className="text-4xl font-bold text-blue-900">{monthData.attendanceRate}%</div>
              <div className="mt-2 text-xs text-blue-600">{monthData.presentDays} of {monthData.totalDays} days</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <CheckCircle2 className="text-white" size={20} />
                </div>
                <span className="text-sm font-medium text-emerald-700">On-Time Days</span>
              </div>
              <div className="text-4xl font-bold text-emerald-900">{onTimeDays}</div>
              <div className="mt-2 text-xs text-emerald-600">{((onTimeDays / monthData.totalDays) * 100).toFixed(1)}% punctuality</div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-gray-700" size={20} />
              <h4 className="font-semibold text-gray-900">Detailed Breakdown</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-gray-600" size={18} />
                  <span className="text-sm text-gray-600">Total Days</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{monthData.totalDays}</div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="text-green-600" size={18} />
                  <span className="text-sm text-green-700">Present</span>
                </div>
                <div className="text-2xl font-bold text-green-700">{monthData.presentDays}</div>
                <div className="text-xs text-green-600 mt-1">{workingDaysPercentage}%</div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="text-red-600" size={18} />
                  <span className="text-sm text-red-700">Absent</span>
                </div>
                <div className="text-2xl font-bold text-red-700">{monthData.absentDays}</div>
                <div className="text-xs text-red-600 mt-1">{absentPercentage}%</div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-orange-600" size={18} />
                  <span className="text-sm text-orange-700">Late Arrivals</span>
                </div>
                <div className="text-2xl font-bold text-orange-700">{monthData.lateDays}</div>
                <div className="text-xs text-orange-600 mt-1">{latePercentage}%</div>
              </div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Attendance Distribution</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Present Days</span>
                  <span className="font-medium text-green-700">{workingDaysPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${workingDaysPercentage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Late Arrivals</span>
                  <span className="font-medium text-orange-700">{latePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${latePercentage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Absent Days</span>
                  <span className="font-medium text-red-700">{absentPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${absentPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              In <span className="font-semibold">{monthData.month}</span>, you attended <span className="font-semibold text-green-700">{monthData.presentDays} days</span> out of <span className="font-semibold">{monthData.totalDays} total days</span>, achieving an attendance rate of <span className="font-semibold text-blue-700">{monthData.attendanceRate}%</span>. You were on time for <span className="font-semibold text-emerald-700">{onTimeDays} days</span> and late for <span className="font-semibold text-orange-700">{monthData.lateDays} days</span>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
