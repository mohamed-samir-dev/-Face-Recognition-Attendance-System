'use client';

import { useState } from 'react';
import { updateSettings } from '@/lib/services/system/settingsService';

const ALL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface WeekendDaysSectionProps {
  weekendDays: string[];
  onUpdate: () => void;
}

export default function WeekendDaysSection({ weekendDays, onUpdate }: WeekendDaysSectionProps) {
  const [selected, setSelected] = useState<string[]>(weekendDays);
  const [original, setOriginal] = useState<string[]>(weekendDays);

  const hasChanged = JSON.stringify([...selected].sort()) !== JSON.stringify([...original].sort());

  const toggle = (day: string) => {
    setSelected(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = async () => {
    try {
      await updateSettings({ weekendDays: selected });
      setOriginal(selected);
      onUpdate();
    } catch (error) {
      console.error('Error saving weekend days:', error);
    }
  };

  const handleCancel = () => setSelected(original);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Weekend Days</h3>
      <p className="text-sm text-gray-500 mb-4">Select the days that are considered weekends (non-working days).</p>
      <div className="flex flex-wrap gap-2">
        {ALL_DAYS.map(day => (
          <button
            key={day}
            onClick={() => toggle(day)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              selected.includes(day)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            {day}
          </button>
        ))}
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
            Save Weekend Days
          </button>
        </div>
      )}
    </div>
  );
}
