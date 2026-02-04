import { useState, useEffect } from "react";
import { getSupervisorLeaveRequests } from "@/lib/services/leave/supervisorLeaveService";

export function usePendingLeaveRequests(supervisorId: string) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const requests = await getSupervisorLeaveRequests(supervisorId);
        const pending = requests.filter(req => req.status === "Pending");
        setPendingCount(pending.length);
      } catch (error) {
        console.error("Error fetching pending leave requests:", error);
      }
    };

    fetchPendingRequests();
    
    const handleLeaveRequestUpdate = () => {
      fetchPendingRequests();
    };

    window.addEventListener('leaveRequestUpdated', handleLeaveRequestUpdate);
    const interval = setInterval(fetchPendingRequests, 30000);

    return () => {
      window.removeEventListener('leaveRequestUpdated', handleLeaveRequestUpdate);
      clearInterval(interval);
    };
  }, [supervisorId]);

  return pendingCount;
}