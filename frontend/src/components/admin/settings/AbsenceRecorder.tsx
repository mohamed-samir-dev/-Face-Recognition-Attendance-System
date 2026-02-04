"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { checkAndRecordAbsences } from "@/lib/services/attendance/absenceService";
import toast from "react-hot-toast";

export default function AbsenceRecorder() {
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  useEffect(() => {
    const checkAndRun = async () => {
      const today = new Date().toISOString().split('T')[0];
      const lastRunDate = localStorage.getItem('lastAbsenceCheck');
      
      if (lastRunDate !== today) {
        try {
          await checkAndRecordAbsences();
          localStorage.setItem('lastAbsenceCheck', today);
          setLastRun(today);
        } catch (error) {
          console.error('Auto absence check failed:', error);
        }
      } else {
        setLastRun(lastRunDate);
      }
    };
    
    checkAndRun();
  }, []);

  const handleRecordAbsences = async () => {
    setLoading(true);
    try {
      await checkAndRecordAbsences();
      toast.success("Absences recorded successfully!");
    } catch (error) {
      toast.error("Failed to record absences");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Record Daily Absences</h2>
      </div>
      <p className="text-gray-600 mb-4">
        Manually trigger absence recording for today. This checks all employees who did not mark attendance and were not on approved leave.
        {lastRun && <span className="block mt-2 text-sm text-green-600">✓ Last auto-check: {lastRun}</span>}
      </p>
      <button
        onClick={handleRecordAbsences}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Recording..." : "Record Today Absences"}
      </button>
    </div>
  );
}
