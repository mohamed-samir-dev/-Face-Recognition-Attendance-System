"use client";

import { Calendar } from "lucide-react";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import FormTextarea from "../../ui/FormTextarea";
import {LeaveDetailsSectionProps}from "../../types"


const leaveTypeOptions = [
  { value: "", label: "Select leave type" },
  { value: "Sick Leave", label: "Sick Leave" },
  { value: "Vacation", label: "Annual Leave / Vacation" },
  { value: "Personal Leave", label: "Personal Leave" },
  { value: "Maternity Leave", label: "Maternity Leave" },
  { value: "Paternity Leave", label: "Paternity Leave" }
];

export default function LeaveDetailsSection({ formData, onChange, dateError, leaveWarning, leaveDaysTaken, allowedLeaveDays }: LeaveDetailsSectionProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const timeDiff = end.getTime() - start.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    }
    return 0;
  };
  
  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
        Leave Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <FormInput
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          icon={Calendar}
          required
          min={today}
          onChange={onChange}
        />
        <FormInput
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          icon={Calendar}
          required
          min={today}
          onChange={onChange}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Days
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
            <Calendar className="text-gray-400 mr-3" size={20} />
            <span className="w-full text-gray-800 font-semibold">
              {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
      </div>
      {dateError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{dateError}</p>
        </div>
      )}
      {leaveWarning && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-amber-800 text-sm font-semibold mb-1">Leave Balance Warning</p>
              <p className="text-amber-700 text-sm">{leaveWarning}</p>
              <p className="text-amber-600 text-xs mt-2">Days used: {leaveDaysTaken} / {allowedLeaveDays}</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6">
        <FormSelect
          label="Type of Leave"
          name="leaveType"
          value={formData.leaveType}
          options={leaveTypeOptions}
          required
          onChange={onChange}
        />
      </div>
      <div className="mt-6">
        <FormTextarea
          label="Reason for Leave"
          name="reason"
          value={formData.reason}
          placeholder="Please provide a detailed explanation for your leave request. Include any relevant information that may assist in the approval process..."
          onChange={onChange}
        />
      </div>
    </div>
  );
}