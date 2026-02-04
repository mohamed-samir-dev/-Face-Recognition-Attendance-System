import { useEffect, useState } from "react";
import { useAuth } from "@/components/dashboard/hooks/useAuth";
import { getTimerInfo } from "@/lib/services/attendance/timerService";
import { getCompanySettings } from "@/lib/services/system/settingsService";
import { WorkingHours } from "@/components/admin";
import { TimerInfo } from "../types";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export function useTimerData() {
  const { user } = useAuth();
  const [timerInfo, setTimerInfo] = useState<TimerInfo | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchTimerInfo = async () => {
      try {
        const [info, settings] = await Promise.all([
          getTimerInfo(user.id),
          getCompanySettings(),
        ]);

        setTimerInfo(info);
        setWorkingHours(settings.workingHours);
      } catch (error) {
        console.error("Error fetching timer info:", error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchTimerInfo();

    // Real-time listener for timer data
    const timerUnsubscribe = onSnapshot(doc(db, "timers", user.id), () => {
      fetchTimerInfo();
    });

    // Real-time listener for settings changes
    const settingsUnsubscribe = onSnapshot(doc(db, "settings", "company"), () => {
      fetchTimerInfo();
    });

    // Listen for timer started event
    const handleTimerStarted = () => {
      setTimeout(fetchTimerInfo, 500); // Small delay to ensure data is written
    };
    window.addEventListener('timerStarted', handleTimerStarted);

    return () => {
      timerUnsubscribe();
      settingsUnsubscribe();
      window.removeEventListener('timerStarted', handleTimerStarted);
    };
  }, [user?.id]);

  return { timerInfo, workingHours, loading };
}
