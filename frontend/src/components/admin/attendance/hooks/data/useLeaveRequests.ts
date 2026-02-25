import { useState, useEffect } from "react";
import { LeaveRequest } from "../../types";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const useLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("attendanceUser") || "{}");
    
    const q = query(collection(db, "leaveRequests"));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LeaveRequest[];
        
        if (user.accountType === 'Supervisor') {
          requests = requests.filter(req => 
            req.supervisorId === user.id && 
            req.requesterAccountType === 'Employee'
          );
        } else if (user.accountType === 'Admin') {
          requests = requests.filter(req => 
            req.requesterAccountType === 'Supervisor' || 
            req.requesterAccountType === 'Manager'
          );
        } else {
          requests = [];
        }
        
        setLeaveRequests(requests);
        setLoading(false);
        setError(null);
      },
      () => {
        setError("Failed to fetch leave requests");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const refetch = () => {
    // No longer needed with real-time updates
  };

  return { leaveRequests, loading, error, refetch };
};