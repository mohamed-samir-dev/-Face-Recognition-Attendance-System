'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { addHoliday } from '@/lib/services/system/settingsService';

interface HolidayFormProps {
  onHolidayAdded: () => void;
}

export default function HolidayForm({ onHolidayAdded }: HolidayFormProps) {
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', endDate: '', type: 'company' as const });

  const handleAddHoliday = async () => {
    if (newHoliday.name && newHoliday.date) {
      try {
        await addHoliday(newHoliday);
        setNewHoliday({ name: '', date: '', endDate: '', type: 'company' as const });
        onHolidayAdded();
      } catch (error) {
        console.error('Error adding holiday:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Holidays</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Holiday Name</label>
          <input
            type="text"
            value={newHoliday.name}
            onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="e.g., New Year's Day"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={newHoliday.date}
            onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={newHoliday.endDate}
            onChange={(e) => setNewHoliday(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        <button
          onClick={handleAddHoliday}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Holiday
        </button>
      </div>
    </div>
  );
}