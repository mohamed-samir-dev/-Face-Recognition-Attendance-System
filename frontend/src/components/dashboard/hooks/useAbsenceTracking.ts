"use client";

import { useEffect } from "react";
import { absenceTrackingService } from "@/lib/services/attendance/absenceTrackingService";

export function useAbsenceTracking() {
  useEffect(() => {
    // Start the absence tracking service when the app loads
    absenceTrackingService.start();

    // Cleanup on unmount
    return () => {
      absenceTrackingService.stop();
    };
  }, []);

  return {
    triggerManualCheck: () => absenceTrackingService.triggerCheck()
  };
}