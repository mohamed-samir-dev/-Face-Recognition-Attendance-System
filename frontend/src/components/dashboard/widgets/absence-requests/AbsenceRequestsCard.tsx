import { useAbsenceData } from "../../hooks/useAbsenceData";
import { AbsenceHeader } from "./components/header/AbsenceHeader";
import { PendingAlert } from "./components/alerts/PendingAlert";
import { RequestsList } from "./components/list/RequestsList";
import { ViewAllButton } from "./components/ui/ViewAllButton";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

export default function AbsenceRequestsCard() {
  const { data, loading, showAll, setShowAll } = useAbsenceData();

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6">
      <AbsenceHeader approvedCount={data.approvedRequests.length} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PendingAlert pendingCount={data.pendingRequests.length} />
          <RequestsList requests={data.recentRequests} />
          <ViewAllButton
            totalCount={data.userRequests.length}
            showAll={showAll}
            onToggle={() => setShowAll(!showAll)}
          />
        </>
      )}
    </div>
  );
}