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
    <div className="flex items-center justify-start sm:justify-end mb-4 sm:mb-6 -mx-3 sm:mx-0 px-3 sm:px-0">
      <div className="flex overflow-x-auto rounded-lg p-1 gap-1 w-full sm:w-auto scrollbar-hide">
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
