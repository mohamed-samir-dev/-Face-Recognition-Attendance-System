import { collection, query, getDocs, orderBy, where, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { AttendanceHistoryRecord } from "@/lib/types/attendanceHistory";
import { getUsers } from "../user/userService";

export async function getAllAttendanceHistory(): Promise<AttendanceHistoryRecord[]> {
  try {
    const historyRef = collection(db, "attendanceHistory");
    const q = query(historyRef, orderBy("timestamp", "desc"));
    
    const snapshot = await getDocs(q);
    const allRecords = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
    } as AttendanceHistoryRecord));
    
    const users = await getUsers();
    const supervisorManagerIds = new Set(
      users
        .filter(u => u.accountType === 'Supervisor' || u.accountType === 'Manager')
        .map(u => u.id)
    );
    
    return allRecords.filter(record => supervisorManagerIds.has(record.userId));
  } catch (error) {
    console.error("Error fetching all attendance history:", error);
    return [];
  }
}

export async function getAttendanceHistoryByDate(date: string): Promise<AttendanceHistoryRecord[]> {
  try {
    const historyRef = collection(db, "attendanceHistory");
    const q = query(
      historyRef,
      where("date", "==", date),
      orderBy("checkIn", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp)
    } as AttendanceHistoryRecord));
  } catch (error) {
    console.error("Error fetching attendance by date:", error);
    return [];
  }
}

export async function deleteAttendanceRecord(recordId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "attendanceHistory", recordId));
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    throw error;
  }
}

export async function deleteAttendanceRecordsByDate(date: string): Promise<void> {
  try {
    const records = await getAttendanceHistoryByDate(date);
    const batch = writeBatch(db);
    records.forEach(record => {
      batch.delete(doc(db, "attendanceHistory", record.id));
    });
    await batch.commit();
  } catch (error) {
    console.error("Error deleting attendance records by date:", error);
    throw error;
  }
}
