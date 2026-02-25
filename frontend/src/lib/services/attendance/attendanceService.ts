import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {  AttendanceStats, DepartmentStats, AbsenceReason } from "@/components/admin/attendance";
import { AttendanceRecord } from "../../types";
import { getUsers } from "../user/userService";
import { getLeaveRequests } from "../leave/leaveService";
import { deleteAbsenceRecord } from "./absenceService";

export const getTodayAttendance = async (): Promise<AttendanceRecord[]> => {
  const today = new Date().toISOString().split('T')[0];
  const attendanceCollection = collection(db, "attendance");
  const q = query(
    attendanceCollection,
    where("date", "==", today)
  );
  
  try {
    const snapshot = await getDocs(q);
    const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
    console.log('Today attendance records:', records.length, records);
    return records;
  } catch (error) {
    console.error('Error fetching today attendance:', error);
    return [];
  }
};

export const getAttendanceStats = async (): Promise<AttendanceStats> => {
  const users = await getUsers();
  const todayAttendance = await getTodayAttendance();
  
  const totalMembers = users.filter(user => user.numericId !== 1).length; // Exclude admin
  
  // Count users with OnLeave status
  const onLeaveToday = users.filter(user => user.numericId !== 1 && user.status === 'OnLeave').length;
  
  const uniqueAttendedUsers = new Set(todayAttendance.map(record => record.userId));
  const presentToday = uniqueAttendedUsers.size;
  const lateToday = todayAttendance.filter(record => record.status === 'Late').length;
  const absentToday = totalMembers - presentToday - onLeaveToday;
  
  console.log('Attendance Stats:', {
    totalMembers,
    todayAttendanceCount: todayAttendance.length,
    uniqueAttendedUsers: Array.from(uniqueAttendedUsers),
    presentToday,
    absentToday,
    lateToday,
    onLeaveToday
  });
  
  return {
    totalMembers,
    presentToday,
    absentToday,
    lateToday,
    onLeaveToday
  };
};

export const getDepartmentStats = async (): Promise<DepartmentStats[]> => {
  const users = await getUsers();
  const todayAttendance = await getTodayAttendance();
  
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales'];
  
  return departments.map(dept => {
    const deptUsers = users.filter(user => 
      user.numericId !== 1 && 
      (user.department === dept || user.Department === dept)
    );
    const deptAttendance = todayAttendance.filter(record => 
      deptUsers.some(user => user.id === record.userId)
    );
    
    const deptUsersOnLeave = deptUsers.filter(user => user.status === 'OnLeave').length;
    const totalMembers = deptUsers.length;
    const uniqueDeptAttendedUsers = new Set(deptAttendance.map(record => record.userId));
    const presentToday = uniqueDeptAttendedUsers.size;
    const lateToday = deptAttendance.filter(record => record.status === 'Late').length;
    const absentToday = totalMembers - presentToday - deptUsersOnLeave;
    
    return {
      department: dept,
      totalMembers,
      presentToday,
      absentToday,
      lateToday,
      onLeaveToday: deptUsersOnLeave
    };
  });
};

export const getMonthlyOvertimeHours = async (userId?: string): Promise<number> => {
  if (!userId) return 0;
  
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const attendanceCollection = collection(db, "attendance");
  const q = query(
    attendanceCollection,
    where("userId", "==", userId),
    where("date", ">=", startOfMonth.toISOString().split('T')[0]),
    where("date", "<=", endOfMonth.toISOString().split('T')[0])
  );
  
  try {
    const snapshot = await getDocs(q);
    const records = snapshot.docs.map(doc => doc.data() as AttendanceRecord);
    
    return records.reduce((total, record) => {
      if (record.checkIn && record.checkOut) {
        const checkIn = new Date(`${record.date}T${record.checkIn}`);
        const checkOut = new Date(`${record.date}T${record.checkOut}`);
        const hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        const overtimeHours = Math.max(0, hoursWorked - 8); // Standard 8-hour workday
        return total + overtimeHours;
      }
      return total + (record.overtimeHours || 0);
    }, 0);
  } catch {
    return 0;
  }
};

export const getMonthlyLateArrivals = async (userId?: string): Promise<number> => {
  if (!userId) return 0;
  
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDateStr = startOfMonth.toISOString().split('T')[0];
  const endDateStr = endOfMonth.toISOString().split('T')[0];
  
  const attendanceCollection = collection(db, "attendance");
  const q = query(
    attendanceCollection,
    where("userId", "==", userId)
  );
  
  try {
    const snapshot = await getDocs(q);
    const lateRecords = snapshot.docs
      .map(doc => doc.data() as AttendanceRecord)
      .filter(record => 
        record.status === "Late" &&
        record.date >= startDateStr &&
        record.date <= endDateStr
      );
    
    return lateRecords.length;
  } catch (error) {
    console.error('Error fetching late arrivals:', error);
    return 0;
  }
};

export const getAbsenceReasons = async (): Promise<AbsenceReason[]> => {
  try {
    const leaveRequests = await getLeaveRequests();
    const approvedLeaves = leaveRequests.filter(req => req.status === 'Approved');
    
    const reasonCounts = approvedLeaves.reduce((acc, leave) => {
      const reason = leave.reason || 'Other';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const total = approvedLeaves.length || 1;
    
    return Object.entries(reasonCounts).map(([reason, count]) => ({
      reason,
      count: count as number,
      percentage: Math.round(((count as number) / total) * 100)
    })).sort((a, b) => (b.count as number) - (a.count as number));
  } catch {
    return [
      { reason: 'Sick Leave', count: 12, percentage: 60 },
      { reason: 'Personal Day', count: 5, percentage: 25 },
      { reason: 'Other', count: 3, percentage: 15 }
    ];
  }
};

export const handleAttendanceMarked = async (userId: string, date: string): Promise<void> => {
  try {
    // Remove any absence record for this user and date since they showed up
    await deleteAbsenceRecord(userId, date);
    console.log(`Cleaned up absence record for user ${userId} on ${date}`);
  } catch (error) {
    console.error('Error cleaning up absence record:', error);
  }
};