import React from "react";
import { PrivacySettingsProps } from "../../types";

export default function PrivacySettings({ attendanceHistoryVisibility, onInputChange }: PrivacySettingsProps) {
  return (
    <div>
      <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
        Privacy Settings
      </h2>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Attendance History Visibility
        </label>
        <p className="text-xs sm:text-sm text-gray-500 mb-3">
          Control who can see your attendance history.
        </p>
        <select
          value={attendanceHistoryVisibility}
          onChange={(e) => onInputChange("attendanceHistoryVisibility", e.target.value)}
          className="w-full sm:max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-gray-50 text-sm sm:text-base"
          disabled
        >
          <option value="team">Team members</option>
        </select>
      </div>
    </div>
  );
}