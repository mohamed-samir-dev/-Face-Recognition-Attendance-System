import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";



interface MonthlyStats {
  dailyData: { day: number; status: number }[];
  monthlyData: { month: string; attendance: number }[];
  monthlyDetails: Map<string, {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    attendanceRate: number;
  }>;
}

export function useMonthlyAttendanceStats(userId: string | undefined) {
  const [stats, setStats] = useState<MonthlyStats>({
    dailyData: [],
    monthlyData: [],
    monthlyDetails: new Map()
  });

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Get daily data for current month
      const startOfMonth = new Date(currentYear, currentMonth, 1);
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
      
      const attendanceRef = collection(db, "attendance");
      const q = query(
        attendanceRef,
        where("userId", "==", userId),
        where("date", ">=", startOfMonth.toISOString().split('T')[0]),
        where("date", "<=", endOfMonth.toISOString().split('T')[0])
      );

      const snapshot = await getDocs(q);
      const attendanceMap = new Map<number, boolean>();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        const day = new Date(data.date).getDate();
        attendanceMap.set(day, true);
      });

      // Create daily data for current month
      const daysInMonth = endOfMonth.getDate();
      const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        status: attendanceMap.has(i + 1) ? 100 : 0
      }));

      // Get monthly data for all 12 months
      const monthlyData = [];
      const monthlyDetails = new Map();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(currentYear, i, 1);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const monthQuery = query(
          attendanceRef,
          where("userId", "==", userId),
          where("date", ">=", monthStart.toISOString().split('T')[0]),
          where("date", "<=", monthEnd.toISOString().split('T')[0])
        );

        const monthSnapshot = await getDocs(monthQuery);
        const daysInTargetMonth = monthEnd.getDate();
        const presentDays = monthSnapshot.size;
        const absentDays = daysInTargetMonth - presentDays;
        
        // Count late arrivals
        let lateDays = 0;
        monthSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.late === true || data.status === 'late') {
            lateDays++;
          }
        });
        
        const attendanceRate = Math.round((presentDays / daysInTargetMonth) * 100);
        
        monthlyData.push({
          month: months[i],
          attendance: attendanceRate
        });

        monthlyDetails.set(months[i], {
          totalDays: daysInTargetMonth,
          presentDays,
          absentDays,
          lateDays,
          attendanceRate
        });
      }

      setStats({ dailyData, monthlyData, monthlyDetails });
    };

    fetchStats();
  }, [userId]);

  return stats;
}
