'use client';

import { useState, useEffect } from 'react';
import { CompanySettings, Holiday } from '../types';
import { getCompanySettings } from '@/lib/services/system/settingsService';
import { WorkingHoursSection, AttendanceRulesSection, VacationDaysSection, HolidayList, LoadingState } from '../components';
import { HolidayForm } from '../forms';
import { EditHolidayModal } from '../modals';

export default function SettingsContent() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expiredHolidays, setExpiredHolidays] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getCompanySettings();
        setSettings(data);
        
        const now = new Date();
        const newExpiredHolidays = new Set<string>();
        
        for (const holiday of data.holidays) {
          const endDate = new Date(holiday.endDate || holiday.date);
          if (endDate < now && !expiredHolidays.has(holiday.id)) {
            newExpiredHolidays.add(holiday.id);
            
            try {
              const { createHolidayExpiredNotificationForAllEmployees } = await import('@/lib/services/system/notificationService');
              const message = `⏰ Holiday ended: ${holiday.name} has concluded. Hope you enjoyed it!`;
              await createHolidayExpiredNotificationForAllEmployees(message);
            } catch (error) {
              console.error('Error sending expired holiday notification:', error);
            }
          }
        }
        
        if (newExpiredHolidays.size > 0) {
          setExpiredHolidays(prev => new Set([...prev, ...newExpiredHolidays]));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [expiredHolidays]);

  const refreshSettings = async () => {
    const updatedSettings = await getCompanySettings();
    setSettings(updatedSettings);
  };

  const openEditModal = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingHoliday(null);
    setIsEditModalOpen(false);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Company Settings</h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <WorkingHoursSection 
          workingHours={settings?.workingHours || { startTime: '09:00', endTime: '17:00' }}
          onUpdate={refreshSettings}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <HolidayForm onHolidayAdded={refreshSettings} />
          <HolidayList 
            holidays={settings?.holidays || []}
            onEditHoliday={openEditModal}
            onHolidayDeleted={refreshSettings}
          />
        </div>

        <AttendanceRulesSection 
          gracePeriod={settings?.attendanceRules?.gracePeriod || 15}
          onUpdate={refreshSettings}
        />

        <VacationDaysSection 
          vacationDays={settings?.attendanceRules?.vacationDays || 30}
          onUpdate={refreshSettings}
        />
      </div>

      {isEditModalOpen && editingHoliday && (
        <EditHolidayModal
          holiday={editingHoliday}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onHolidayUpdated={refreshSettings}
        />
      )}
    </div>
  );
}