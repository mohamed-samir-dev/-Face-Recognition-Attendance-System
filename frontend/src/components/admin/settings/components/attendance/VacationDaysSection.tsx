'use client';

import { useState } from 'react';
import { updateSettings } from '@/lib/services/system/settingsService';

interface VacationDaysSectionProps {
  vacationDays: number;
  onUpdate: () => void;
}

export default function VacationDaysSection({ vacationDays, onUpdate }: VacationDaysSectionProps) {
  const [localVacationDays, setLocalVacationDays] = useState(vacationDays);
  const [originalVacationDays, setOriginalVacationDays] = useState(vacationDays);

  const hasChanged = localVacationDays !== originalVacationDays;

  const handleSave = async () => {
    try {
      const { getCompanySettings } = await import('@/lib/services/system/settingsService');
      const currentSettings = await getCompanySettings();
      await updateSettings({ 
        attendanceRules: { 
          ...currentSettings.attendanceRules,
          vacationDays: localVacationDays 
        } 
      });
      setOriginalVacationDays(localVacationDays);
      onUpdate();
    } catch (error) {
      console.error('Error saving vacation days:', error);
    }
  };

  const handleCancel = () => {
    setLocalVacationDays(originalVacationDays);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Vacation Days</h3>
      <div className="w-full sm:max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-2">Days per Year</label>
        <select 
          value={localVacationDays}
          onChange={(e) => setLocalVacationDays(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          <option value={30}>30</option>
          <option value={40}>40</option>
          <option value={45}>45</option>
        </select>
      </div>
      
      {hasChanged && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Vacation Days
          </button>
        </div>
      )}
    </div>
  );
}
