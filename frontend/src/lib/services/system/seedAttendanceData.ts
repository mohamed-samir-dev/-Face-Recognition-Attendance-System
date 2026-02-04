import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { AttendanceRecord } from "@/lib/types";
import { getUsers } from "../user/userService";

export const seedTodayAttendance = async (): Promise<void> => {
  try {
    const users = await getUsers();
    const today = new Date().toISOString().split('T')[0];
    const attendanceCollection = collection(db, "attendance");
    
    // Filter out admin user
    const employees = users.filter(user => user.numericId !== 1);
    
    // Create sample attendance records for today
    const attendancePromises = employees.map(async (user, index) => {
      const attendanceRef = doc(attendanceCollection);
      
      // Simulate different attendance statuses
      const statuses: ('Present' | 'Absent' | 'Late')[] = ['Present', 'Present', 'Present', 'Present', 'Absent', 'Late'];
      const status = statuses[index % statuses.length];
      
      const attendanceRecord: AttendanceRecord = {
        id: attendanceRef.id,
        userId: user.id,
        date: today,
        status,
        department: user.department || user.Department || 'IT',
        ...(status !== 'Absent' && {
          checkIn: status === 'Late' ? '09:15:00' : '09:00:00',
          checkOut: '17:30:00'
        })
      };
      
      await setDoc(attendanceRef, attendanceRecord);
    });
    
    await Promise.all(attendancePromises);
    console.log('Sample attendance data seeded successfully');
  } catch (error) {
    console.error('Error seeding attendance data:', error);
  }
};