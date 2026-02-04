import { Clock, AlertTriangle, XCircle, Timer } from "lucide-react";
import { SummaryCard } from "./SummaryCard";
import MonthlyAbsencesCard from "./MonthlyAbsencesCard";
import { AttendanceData } from "../../../../types";
import { formatHoursForCard } from "@/lib/utils/timeFormatters";

interface SummaryGridProps {
  data: AttendanceData;
}

export function SummaryGrid({ data }: SummaryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      <SummaryCard
        title="Total Hours Worked"
        value={formatHoursForCard(data.totalHours)}
        timer={data.timeRemaining}
        icon={<Clock className="w-5 h-5" />}
      />

      <SummaryCard
        title="Overtime"
        value={formatHoursForCard(data.overtimeHours)}
        overtimeTimer={data.overtimeTimer}
        color="green"
        icon={<Timer className="w-5 h-5" />}
      />

      <SummaryCard
        title="Late Arrivals"
        value={`${data.lateArrivals} days`}
        color="yellow"
        icon={<AlertTriangle className="w-5 h-5" />}
      />

      <SummaryCard
        title="Leave Days Taken (Y)"
        value={data.leaveDays}
        color="red"
        icon={<XCircle className="w-5 h-5" />}
      />

      <MonthlyAbsencesCard />
    </div>
  );
}