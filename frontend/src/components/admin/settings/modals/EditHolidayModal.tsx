'use client';

import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { EditHolidayModalProps } from '../types';
import { updateHoliday } from '@/lib/services/system/settingsService';


export default function EditHolidayModal({ holiday, isOpen, onClose, onHolidayUpdated }: EditHolidayModalProps) {
  const [editingHoliday, setEditingHoliday] = useState(holiday);

  const handleSave = async () => {
    try {
      await updateHoliday(editingHoliday.id, editingHoliday);
      onHolidayUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating holiday:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all border border-gray-200">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-black">Edit Holiday</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Holiday Name
              </label>
              <input
                type="text"
                value={editingHoliday.name}
                onChange={(e) => setEditingHoliday({...editingHoliday, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black bg-white"
                placeholder="Enter holiday name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={editingHoliday.date}
                onChange={(e) => setEditingHoliday({...editingHoliday, date: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black bg-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={editingHoliday.endDate || ''}
                onChange={(e) => setEditingHoliday({...editingHoliday, endDate: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black bg-white"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-8">
            <button
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-3 text-black bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}