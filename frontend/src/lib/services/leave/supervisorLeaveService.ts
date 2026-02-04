import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { LeaveRequest } from "@/components/admin";

export const getSupervisorLeaveRequests = async (supervisorId: string): Promise<LeaveRequest[]> => {
  try {
    const leaveCollection = collection(db, "leaveRequests");
    const q = query(
      leaveCollection,
      where("supervisorId", "==", supervisorId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
  } catch (error) {
    console.error("Error fetching supervisor leave requests:", error);
    return [];
  }
};
