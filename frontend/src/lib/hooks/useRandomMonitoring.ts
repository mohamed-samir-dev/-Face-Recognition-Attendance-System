import { useEffect, useState } from "react";
import { canShowMonitoring, calculateNextMonitoringDelay, updateLastMonitoringTime } from "@/lib/services/monitoring/randomMonitoringService";

export const useRandomMonitoring = (employeeId: string | undefined) => {
  const [showMonitoring, setShowMonitoring] = useState(false);

  useEffect(() => {
    if (!employeeId) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleNextMonitoring = async () => {
      const canShow = await canShowMonitoring(employeeId);
      
      if (canShow) {
        setShowMonitoring(true);
        await updateLastMonitoringTime(employeeId);
      }

      const delay = calculateNextMonitoringDelay();
      timeoutId = setTimeout(scheduleNextMonitoring, delay);
    };

    scheduleNextMonitoring();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [employeeId]);

  const closeMonitoring = () => setShowMonitoring(false);

  return { showMonitoring, closeMonitoring };
};
