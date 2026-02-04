import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {LeaveDaysRecord}from "../../types/services"


export const addLeaveDaysRecord = async (record: Omit<LeaveDaysRecord, 'id'>): Promise<void> => {
  const recordId = `leave_days_${record.employeeId}_${Date.now()}`;
  const recordRef = doc(db, "leaveDaysTaken", recordId);
  
  await setDoc(recordRef, {
    id: recordId,
    ...record
  });
};

export const getUserLeaveDays = async (employeeId: string): Promise<number> => {
  const leaveDaysCollection = collection(db, "leaveDaysTaken");
  const q = query(leaveDaysCollection, where("employeeId", "==", employeeId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.reduce((total, doc) => {
    const data = doc.data() as LeaveDaysRecord;
    return total + data.leaveDays;
  }, 0);
};

export const deleteLeaveDaysRecord = async (leaveRequestId: string): Promise<void> => {
  const leaveDaysCollection = collection(db, "leaveDaysTaken");
  const q = query(leaveDaysCollection, where("leaveRequestId", "==", leaveRequestId));
  const snapshot = await getDocs(q);
  
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};