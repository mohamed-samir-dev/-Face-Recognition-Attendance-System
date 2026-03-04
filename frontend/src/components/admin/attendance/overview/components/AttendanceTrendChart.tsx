'use client';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface TrendData {
  date: string;
  present: number;
  late: number;
  absent: number;
}

export default function AttendanceTrendChart() {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [todayPresent, setTodayPresent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toISOString().split('T')[0];
        });

        const attendanceRef = collection(db, 'attendance');
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        const q = query(
          attendanceRef,
          where('date', '>=', startDate.toISOString().split('T')[0])
        );

        const snapshot = await getDocs(q);
        const attendanceByDate: Record<string, { present: number; late: number; absent: number }> = {};

        last7Days.forEach(date => {
          attendanceByDate[date] = { present: 0, late: 0, absent: 0 };
        });

        let todayCount = 0;
        snapshot.forEach(doc => {
          const data = doc.data();
          const date = data.date;
          if (attendanceByDate[date]) {
            if (data.status === 'Present') {
              attendanceByDate[date].present++;
              if (date === today) todayCount++;
            }
            else if (data.status === 'Late') {
              attendanceByDate[date].late++;
              if (date === today) todayCount++;
            }
            else if (data.status === 'Absent') attendanceByDate[date].absent++;
          }
        });

        const chartData = last7Days.map(date => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          present: attendanceByDate[date].present,
          late: attendanceByDate[date].late,
          absent: attendanceByDate[date].absent,
        }));

        setTrendData(chartData);
        setTodayPresent(todayCount);
      } catch (error) {
        console.error('Error fetching trend data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Attendance Trend</h3>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">Today: {todayPresent} Present</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={trendData}>
          <defs>
            <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Area type="monotone" dataKey="present" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" />
          <Area type="monotone" dataKey="late" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLate)" />
          <Area type="monotone" dataKey="absent" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbsent)" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-sm text-gray-600">Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600">Absent</span>
        </div>
      </div>
    </div>
  );
}
