import { useState, useEffect } from "react";
import { LeaveRequest } from "@/components/admin/attendance/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const useUserLeaveRequests = (userId?: string) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "leaveRequests"),
      where("employeeId", "==", userId)
    );
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LeaveRequest[];
        
        setLeaveRequests(requests);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError("Failed to fetch leave requests");
        setLoading(false);
        console.error("Error fetching user leave requests:", err);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { leaveRequests, loading, error };
};