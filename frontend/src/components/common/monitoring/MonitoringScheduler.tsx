"use client";

import { useEffect } from "react";
import { getCompanySettings } from "@/lib/services/system/settingsService";
import { sendMonitoringAlert } from "@/lib/services/system/monitoringService";
import { getUsers } from "@/lib/services/user/userService";

export default function MonitoringScheduler() {
  useEffect(() => {

    const scheduleRandomAlerts = async () => {
      try {
        const settings = await getCompanySettings();
        
        if (!settings.attendanceRules.monitoringEnabled) return;

        const minInterval = (settings.attendanceRules.monitoringMinInterval || 60) * 60000;
        const maxInterval = (settings.attendanceRules.monitoringMaxInterval || 180) * 60000;

        const users = await getUsers();
        const targets = users.filter(u => 
          (u.accountType === 'Employee' || u.accountType === 'Supervisor') && 
          u.numericId && 
          u.status === 'Active'
        );

        for (const user of targets) {
          const randomDelay = Math.floor(Math.random() * (maxInterval - minInterval) + minInterval);
          
          setTimeout(async () => {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            if (currentTime >= settings.workingHours.startTime && currentTime <= settings.workingHours.endTime) {
              await sendMonitoringAlert(user.numericId!.toString());
            }
          }, randomDelay);
        }
      } catch (error) {
        console.error('Error scheduling alerts:', error);
      }
    };

    scheduleRandomAlerts();
    const intervalId = setInterval(scheduleRandomAlerts, 3600000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return null;
}
