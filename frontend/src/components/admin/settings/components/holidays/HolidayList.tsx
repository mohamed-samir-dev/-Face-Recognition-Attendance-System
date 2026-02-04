'use client';

import { Edit, Trash2 } from 'lucide-react';
import { HolidayListProps } from '../../types';
import { deleteHoliday } from '@/lib/services/system/settingsService';



export default function HolidayList({ holidays, onEditHoliday, onHolidayDeleted }: HolidayListProps) {
  const handleDeleteHoliday = async (holidayId: string, holidayName: string) => {
    try {
      await deleteHoliday(holidayId, holidayName);
      onHolidayDeleted();
    } catch (error) {
      console.error('Error deleting holiday:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Holidays</h4>
        {holidays.length > 0 && (
          <span className="bg-white text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-300">
            {holidays.length}
          </span>
        )}
      </div>
      <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
        {holidays.length > 0 ? (
          holidays
            .sort((a, b) => {
              const now = new Date();
              const aExpired = new Date(a.endDate || a.date) < now;
              const bExpired = new Date(b.endDate || b.date) < now;
              
              if (aExpired && !bExpired) return 1;
              if (!aExpired && bExpired) return -1;
              
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            })
            .map((holiday) => (
            <div key={holiday.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 px-3 sm:px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-2">
              <div className="flex-1">
                <span className={`text-gray-900 font-medium text-sm sm:text-base ${
                  new Date(holiday.endDate || holiday.date) < new Date() 
                    ? 'line-through text-gray-400' 
                    : ''
                }`}>
                  {holiday.name}
                </span>
                <div className={`text-gray-500 text-xs sm:text-sm ${
                  new Date(holiday.endDate || holiday.date) < new Date() 
                    ? 'line-through text-gray-400' 
                    : ''
                }`}>
                  {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {holiday.endDate && ` - ${new Date(holiday.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                </div>
              </div>
              <div className="flex space-x-2 self-end sm:self-center">
                <button
                  onClick={() => onEditHoliday(holiday)}
                  className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit Holiday"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteHoliday(holiday.id, holiday.name)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete Holiday"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            ))
        ) : (
          <div className="text-gray-500 text-sm text-center py-8">No holidays added yet</div>
        )}
      </div>
    </div>
  );
}