"use client";

import { useState, useEffect } from "react";
import { Clock, Save } from "lucide-react";
import toast from "react-hot-toast";
import { getCompanySettings, updateSettings } from "@/lib/services/system/settingsService";
import { CompanySettings } from "./types";

export default function AttendanceSettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getCompanySettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Attendance Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grace Period (minutes)
            </label>
            <input
              type="number"
              min="0"
              value={settings.attendanceRules.gracePeriod}
              onChange={(e) => setSettings({ ...settings, attendanceRules: { ...settings.attendanceRules, gracePeriod: parseInt(e.target.value) || 0 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Grace period in minutes before marking attendance as late
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vacation Days
            </label>
            <input
              type="number"
              min="0"
              value={settings.attendanceRules.vacationDays || 30}
              onChange={(e) => setSettings({ ...settings, attendanceRules: { ...settings.attendanceRules, vacationDays: parseInt(e.target.value) || 30 } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Annual vacation days per employee
            </p>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Monitoring System</h3>
                <p className="text-sm text-gray-500">Random alerts during working hours</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.attendanceRules.monitoringEnabled ?? false}
                  onChange={(e) => setSettings({ ...settings, attendanceRules: { ...settings.attendanceRules, monitoringEnabled: e.target.checked } })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.attendanceRules.monitoringEnabled && (
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Interval (minutes)
                  </label>
                  <input
                    type="number"
                    min="30"
                    value={settings.attendanceRules.monitoringMinInterval || 60}
                    onChange={(e) => setSettings({ ...settings, attendanceRules: { ...settings.attendanceRules, monitoringMinInterval: parseInt(e.target.value) || 60 } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum time between alerts
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Interval (minutes)
                  </label>
                  <input
                    type="number"
                    min="60"
                    value={settings.attendanceRules.monitoringMaxInterval || 180}
                    onChange={(e) => setSettings({ ...settings, attendanceRules: { ...settings.attendanceRules, monitoringMaxInterval: parseInt(e.target.value) || 180 } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum time between alerts
                  </p>
                </div>
              </div>
            )}
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
    </div>
  );
}
