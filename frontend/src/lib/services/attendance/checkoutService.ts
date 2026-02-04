import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { completeTimer } from "./timerService";

export async function recordCheckOut(userId: string, userName: string): Promise<{
  success: boolean;
  message: string;
  workedHours?: number;
}> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    const attendanceRef = collection(db, "attendance");
    const q = query(attendanceRef, where("userId", "==", userId), where("date", "==", today));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, message: "No check-in record found for today. Please check in first." };
    }

    const attendanceDoc = querySnapshot.docs[0];
    const attendanceData = attendanceDoc.data();
    
    if (attendanceData.checkOut) {
      return { success: false, message: "You have already checked out today." };
    }

    const checkInTime = new Date(`${today}T${attendanceData.checkIn}`);
    const checkOutTime = new Date(`${today}T${currentTime}`);
    const workedMs = checkOutTime.getTime() - checkInTime.getTime();
    const workedHours = Math.round((workedMs / (1000 * 60 * 60)) * 100) / 100;

    const { getCompanySettings } = await import('../system/settingsService');
    const settings = await getCompanySettings();
    const workEnd = new Date(`${today}T${settings.workingHours.endTime}:00`);
    const overtimeHours = checkOutTime.getTime() > workEnd.getTime() 
      ? Math.round(((checkOutTime.getTime() - workEnd.getTime()) / (1000 * 60 * 60)) * 100) / 100 
      : 0;

    await updateDoc(doc(db, "attendance", attendanceDoc.id), {
      checkOut: currentTime,
      workedHours: workedHours,
      overtimeHours: overtimeHours,
      updatedAt: new Date()
    });

    await updateAttendanceHistory(userId, currentTime, workedHours);
    await completeTimer(userId);

    const { updateUserStatus } = await import('../user/statusService');
    await updateUserStatus(userId, 'Inactive');

    return { success: true, message: "Check-out recorded successfully", workedHours };
  } catch (error) {
    console.error("Error recording check-out:", error);
    return { success: false, message: "Failed to record check-out" };
  }
}

async function updateAttendanceHistory(userId: string, checkOutTime: string, workedHours: number): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const historyRef = collection(db, "attendanceHistory");
    const q = query(
      historyRef,
      where("userId", "==", userId),
      where("date", "==", today)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const historyDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "attendanceHistory", historyDoc.id), {
        checkOut: checkOutTime,
        workedHours: workedHours,
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error("Error updating attendance history:", error);
  }
}

export async function checkCanCheckOut(userId: string): Promise<{
  canCheckOut: boolean;
  message: string;
  hasCheckedIn?: boolean;
  hasCheckedOut?: boolean;
}> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const attendanceRef = collection(db, "attendance");
    const q = query(attendanceRef, where("userId", "==", userId), where("date", "==", today));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { canCheckOut: false, message: "No check-in record found for today", hasCheckedIn: false, hasCheckedOut: false };
    }

    const attendanceData = querySnapshot.docs[0].data();
    
    if (attendanceData.checkOut) {
      return { canCheckOut: false, message: "Already checked out today", hasCheckedIn: true, hasCheckedOut: true };
    }

    return { canCheckOut: true, message: "Ready to check out", hasCheckedIn: true, hasCheckedOut: false };
  } catch (error) {
    console.error("Error checking check-out status:", error);
    return { canCheckOut: false, message: "Error checking status" };
  }
}