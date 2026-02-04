import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { AttendanceHistoryRecord } from "@/lib/types/attendanceHistory";

export async function getSupervisorTeamAttendance(supervisorId: string): Promise<AttendanceHistoryRecord[]> {
  try {
    const historyRef = collection(db, "attendanceHistory");
    const q = query(
      historyRef,
      where("supervisorId", "==", supervisorId),
      orderBy("timestamp", "desc")
    );
    
    const snapshot = await getDocs(q);
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
    } as AttendanceHistoryRecord));
    
    const filteredRecords = records.filter(record => record.userId !== supervisorId);
    
    console.log('Supervisor team attendance:', {
      supervisorId,
      recordCount: filteredRecords.length,
      records: filteredRecords
    });
    
    return filteredRecords;
  } catch (error) {
    console.error("Error fetching supervisor team attendance:", error);
    return [];
  }
}
