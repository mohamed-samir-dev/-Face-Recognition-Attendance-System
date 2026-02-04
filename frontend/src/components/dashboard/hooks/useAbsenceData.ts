import { useState, useMemo } from "react";
import { useAuth } from "./useAuth";
import { useUserLeaveRequests } from "./useUserLeaveRequests";
import { AbsenceRequestsData } from "../types";

export function useAbsenceData() {
  const { user } = useAuth();
  const { leaveRequests, loading } = useUserLeaveRequests(user?.numericId?.toString());
  const [showAll, setShowAll] = useState(false);

  const data: AbsenceRequestsData = useMemo(() => {
    const userRequests = leaveRequests;
    const pendingRequests = userRequests.filter((r) => r.status === "Pending");
    const approvedRequests = userRequests.filter(
      (r) => r.status === "Approved"
    );
    const recentRequests = showAll ? userRequests : userRequests.slice(0, 3);

    return {
      userRequests,
      pendingRequests,
      approvedRequests,
      recentRequests,
    };
  }, [leaveRequests, showAll]);

  return {
    data,
    loading,
    showAll,
    setShowAll,
  };
}
