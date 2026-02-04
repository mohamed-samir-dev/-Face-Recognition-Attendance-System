import { StatusTabsProps } from "../../../../types";
import { statusTabs } from "../../../shared";
import { useTabCounts } from "../../../../hooks/ui/useTabCounts";
import StatusTab from "./StatusTab";

export default function StatusTabs({
  statusFilter,
  setStatusFilter,
  leaveRequests,
}: StatusTabsProps) {
  const { getTabCount, getBadgeColor } = useTabCounts(leaveRequests);

  return (
    <div className="flex items-center justify-end mb-6">
      <div className="flex overflow-x-auto rounded-lg p-1">
        {statusTabs.map((tab) => (
          <StatusTab
            key={tab}
            tab={tab}
            isActive={statusFilter === tab}
            count={getTabCount(tab)}
            badgeColor={getBadgeColor(tab)}
            onClick={() => setStatusFilter(tab)}
          />
        ))}
      </div>
    </div>
  );
}
