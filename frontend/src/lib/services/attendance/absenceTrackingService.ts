"use client";

import { checkAndRecordAbsences } from "./absenceService";

class AbsenceTrackingService {
  private intervalId: NodeJS.Timeout | null = null;
  private lastCheckedDate: string | null = null;

  start() {
    // Check immediately on start
    this.checkAbsences();
    
    // Then check every hour
    this.intervalId = setInterval(() => {
      this.checkAbsences();
    }, 60 * 60 * 1000); // 1 hour
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async checkAbsences() {
    const today = new Date().toISOString().split('T')[0];
    
    if (this.lastCheckedDate !== today) {
      try {
        await checkAndRecordAbsences();
        this.lastCheckedDate = today;
        console.log(`Absence check completed for ${today}`);
      } catch (error) {
        console.error('Error in absence tracking service:', error);
      }
    }
  }

  // Manual trigger for testing
  async triggerCheck() {
    await checkAndRecordAbsences();
    this.lastCheckedDate = new Date().toISOString().split('T')[0];
  }
}

export const absenceTrackingService = new AbsenceTrackingService();