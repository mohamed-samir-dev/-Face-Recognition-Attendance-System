'use client';

import { useState } from 'react';
import { updateSettings } from '@/lib/services/system/settingsService';
import {WorkingHoursSectionProps}from "../../types"

export default function WorkingHoursSection({ workingHours, onUpdate }: WorkingHoursSectionProps) {
  const [localHours, setLocalHours] = useState(workingHours);
  const [originalHours, setOriginalHours] = useState(workingHours);

  const hasChanged = localHours.startTime !== originalHours.startTime || localHours.endTime !== originalHours.endTime;

  const handleSave = async () => {
    try {
      await updateSettings({ workingHours: localHours });
      const { createWorkingHoursChangeNotificationForAllEmployees } = await import('@/lib/services/system/notificationService');
      const message = `⏰ Working hours updated: New schedule is ${localHours.startTime} - ${localHours.endTime}`;
      await createWorkingHoursChangeNotificationForAllEmployees(message);
      setOriginalHours(localHours);
      onUpdate(localHours);
    } catch (error) {
      console.error('Error saving working hours:', error);
    }
  };

  const handleCancel = () => {
    setLocalHours(originalHours);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
          <select 
            value={localHours.startTime}
            onChange={(e) => setLocalHours(prev => ({ ...prev, startTime: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="06:00">6:00 AM</option>
            <option value="06:30">6:30 AM</option>
            <option value="07:00">7:00 AM</option>
            <option value="07:30">7:30 AM</option>
            <option value="08:00">8:00 AM</option>
            <option value="08:30">8:30 AM</option>
            <option value="09:00">9:00 AM</option>
            <option value="09:30">9:30 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="10:30">10:30 AM</option>
            <option value="11:00">11:00 AM</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
          <select 
            value={localHours.endTime}
            onChange={(e) => setLocalHours(prev => ({ ...prev, endTime: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            <option value="14:00">2:00 PM</option>
            <option value="14:30">2:30 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="15:30">3:30 PM</option>
            <option value="16:00">4:00 PM</option>
            <option value="16:30">4:30 PM</option>
            <option value="17:00">5:00 PM</option>
            <option value="17:30">5:30 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="18:30">6:30 PM</option>
            <option value="19:00">7:00 PM</option>
            <option value="19:30">7:30 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="20:30">8:30 PM</option>
            <option value="21:00">9:00 PM</option>
            <option value="21:30">9:30 PM</option>
            <option value="22:00">10:00 PM</option>
          </select>
        </div>
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
            Save Working Hours
          </button>
        </div>
      )}
    </div>
  );
}