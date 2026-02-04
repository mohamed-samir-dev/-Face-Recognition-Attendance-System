"use client";

import { useState, useEffect } from "react";
import { Clock, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function AttendanceSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    id: "attendance",
    attendanceDeadlineTime: "09:00",
    penaltyDaysPerAbsence: 1
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSystemSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSystemSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Attendance Deadline Settings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attendance Deadline Time
          </label>
          <input
            type="time"
            value={settings.attendanceDeadlineTime}
            onChange={(e) => setSettings({ ...settings, attendanceDeadlineTime: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Employees must register attendance before this time to avoid penalties
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Penalty Days Per Absence
          </label>
          <input
            type="number"
            min="1"
            value={settings.penaltyDaysPerAbsence}
            onChange={(e) => setSettings({ ...settings, penaltyDaysPerAbsence: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Number of penalty days deducted from salary per unexcused absence
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
}
