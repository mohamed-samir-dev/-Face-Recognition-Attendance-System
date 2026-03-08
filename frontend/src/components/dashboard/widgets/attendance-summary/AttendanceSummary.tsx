"use client";

import { useAttendanceData } from "../../hooks/useAttendanceData";
import { useLateToast } from "../../hooks/useLateToast";
import { SummaryGrid } from "./components/cards/SummaryGrid";
import { LateToast } from "./components/notifications/LateToast";
import AbsenceRequestsCard from "../AbsenceRequestsCard";

export default function AttendanceSummary() {
  const data = useAttendanceData();
  const { showLateToast, setShowLateToast } = useLateToast();

  return (
    <div className="mb-6 sm:mb-8">
      <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] mb-3 sm:mb-4 px-1">
        Monthly Attendance Summary
      </h3>
      <SummaryGrid data={data} />
      <AbsenceRequestsCard />
      <LateToast
        isVisible={showLateToast}
        onClose={() => setShowLateToast(false)}
      />
    </div>
  );
}
