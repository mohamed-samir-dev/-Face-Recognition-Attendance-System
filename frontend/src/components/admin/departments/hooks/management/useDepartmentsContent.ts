'use client';

import { useState, useEffect } from 'react';
import { getCompanySettings } from '@/lib/services/system/settingsService';
import { CompanySettings } from '@/components/admin/settings';

export function useDepartmentsContent() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useDepartmentsContent - Starting to fetch settings');
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    console.log('useDepartmentsContent - fetchSettings called');
    try {
      console.log('useDepartmentsContent - Calling getCompanySettings');
      const data = await getCompanySettings();
      console.log('useDepartmentsContent - Settings received:', data);
      setSettings(data);
    } catch (error) {
      console.error('useDepartmentsContent - Error fetching settings:', error);
    } finally {
      console.log('useDepartmentsContent - Setting loading to false');
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    fetchSettings
  };
}