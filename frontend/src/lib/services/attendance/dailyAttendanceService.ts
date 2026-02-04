import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function checkDailyAttendance(userId: string): Promise<{
  hasAttendance: boolean;
  message: string;
}> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const attendanceRef = collection(db, "attendance");
    const q = query(
      attendanceRef,
      where("userId", "==", userId),
      where("date", "==", today)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return {
        hasAttendance: true,
        message: "You have already taken attendance today. Please try again tomorrow."
      };
    }
    
    return {
      hasAttendance: false,
      message: "No attendance found for today"
    };
    
  } catch (error) {
    console.error("Error checking daily attendance:", error);
    return {
      hasAttendance: false,
      message: "Error checking attendance status"
    };
  }
}

export async function recordDailyAttendance(userId: string, userName: string): Promise<{
  success: boolean;
  message: string;
  isLate?: boolean;
}> {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0];
    
    // Check if user is on leave
    const { checkIfOnLeaveToday } = await import('./attendanceHistoryService');
    const leaveStatus = await checkIfOnLeaveToday(userId);
    
    if (leaveStatus.isOnLeave) {
      return {
        success: false,
        message: `You are on approved leave today (${leaveStatus.leaveReason}). Attendance registration is prohibited.`
      };
    }
    
    // Determine status based on check-in time
    const { getCompanySettings } = await import('../system/settingsService');
    const settings = await getCompanySettings();
    const workStartTime = settings.workingHours.startTime;
    const gracePeriod = settings.attendanceRules?.gracePeriod || 15;
    
    const workStart = new Date(`${today}T${workStartTime}:00`);
    const checkInTime = new Date(`${today}T${currentTime}`);
    const graceEndTime = new Date(workStart.getTime() + gracePeriod * 60 * 1000);
    
    let status = 'Present';
    let lateMinutes = 0;
    if (checkInTime > graceEndTime) {
      status = 'Late';
      lateMinutes = Math.floor((checkInTime.getTime() - graceEndTime.getTime()) / (1000 * 60));
      console.log('Late arrival detected:', {
        checkInTime: currentTime,
        workStartTime,
        gracePeriod,
        graceEndTime: graceEndTime.toTimeString(),
        lateMinutes
      });
    }
    
    const attendanceData = {
      userId,
      employeeName: userName,
      date: today,
      checkIn: currentTime,
      status,
      timestamp: now,
      workedHours: 0
    };
    
    await addDoc(collection(db, "attendance"), attendanceData);
    
    // Record in attendance history
    const { recordAttendanceHistory } = await import('./attendanceHistoryService');
    await recordAttendanceHistory(
      userId,
      userName,
      status as 'Present' | 'Late',
      currentTime,
      status === 'Late',
      lateMinutes
    );
    
    // Update user status to Active
    const { updateUserStatus } = await import('../user/statusService');
    await updateUserStatus(userId, 'Active');
    
    // Clean up any absence record for today since they showed up
    const { handleAttendanceMarked } = await import('./attendanceService');
    await handleAttendanceMarked(userId, today);
    
    console.log('Attendance recorded:', attendanceData);
    
    return {
      success: true,
      message: "Attendance recorded successfully",
      isLate: status === 'Late'
    };
    
  } catch (error) {
    console.error("Error recording attendance:", error);
    return {
      success: false,
      message: "Failed to record attendance"
    };
  }
}