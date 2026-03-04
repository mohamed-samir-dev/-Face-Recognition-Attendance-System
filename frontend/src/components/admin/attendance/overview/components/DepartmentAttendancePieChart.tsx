'use client';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface DepartmentData {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function DepartmentAttendancePieChart() {
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Get all users
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        // Get today's attendance
        const attendanceRef = collection(db, 'attendance');
        const attendanceQuery = query(attendanceRef, where('date', '==', today));
        const attendanceSnapshot = await getDocs(attendanceQuery);
        
        // Map attendance by user ID
        const attendanceMap = new Map();
        attendanceSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status === 'Present' || data.status === 'Late') {
            attendanceMap.set(data.userId, true);
          }
        });
        
        // Count present employees by department
        const deptCount: Record<string, number> = {};
        usersSnapshot.forEach(doc => {
          const user = doc.data();
          if (user.numericId === 1) return; // Skip admin
          
          const dept = user.department || user.Department || 'No Department';
          const userId = doc.id;
          
          if (attendanceMap.has(userId)) {
            deptCount[dept] = (deptCount[dept] || 0) + 1;
          }
        });
        
        // Convert to chart data
        const chartData = Object.entries(deptCount)
          .map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length]
          }))
          .filter(d => d.value > 0);
        
        setDepartmentData(chartData);
      } catch (error) {
        console.error('Error fetching department data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-80 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  const totalPresent = departmentData.reduce((sum, dept) => sum + dept.value, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Attendance by Department</h3>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium text-blue-700">Total: {totalPresent} Present</span>
        </div>
      </div>
      
      {departmentData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value} employees`, 'Present']}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                <span className="text-sm text-gray-700 font-medium">{dept.name}</span>
                <span className="text-sm text-gray-500 ml-auto">{dept.value}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-400">
          No attendance data for today
        </div>
      )}
    </div>
  );
}
