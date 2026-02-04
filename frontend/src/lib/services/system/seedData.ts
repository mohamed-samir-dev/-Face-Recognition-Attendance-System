import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { User } from "@/lib/types";

export const seedAttendanceData = async () => {
  try {
    // Check if attendance data already exists
    const attendanceSnapshot = await getDocs(collection(db, "attendance"));
    if (attendanceSnapshot.size > 0) {
      console.log("Attendance data already exists");
      return;
    }

    // Get users to create attendance for
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));

    const attendanceData = [];
    const today = new Date();

    // Create 30 days of attendance data
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      for (const user of users) {
        if (user.numericId === 1) continue; // Skip admin

        const random = Math.random();
        let status: 'Present' | 'Absent' | 'Late';
        
        if (random < 0.8) status = 'Present';
        else if (random < 0.9) status = 'Late';
        else status = 'Absent';

        attendanceData.push({
          userId: user.id,
          employeeId: user.numericId?.toString(),
          userName: user.name,
          numericId: user.numericId,
          date: dateStr,
          status,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Add to database
    for (const record of attendanceData) {
      await addDoc(collection(db, "attendance"), record);
    }

    console.log(`Created ${attendanceData.length} attendance records`);
  } catch (error) {
    console.error("Error seeding attendance data:", error);
  }
};