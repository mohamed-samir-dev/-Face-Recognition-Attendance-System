import { DepartmentAttendanceProps } from '../../types';
import { calculateAttendancePercentage } from '../shared';

export default function DepartmentAttendance({ departmentStats }: DepartmentAttendanceProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Attendance</h3>
      <div className="space-y-3">
        {departmentStats.map((dept) => (
          <div key={dept.department} className="flex justify-between items-center">
            <span className="text-gray-700">{dept.department}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{dept.presentToday}/{dept.totalMembers}</span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${calculateAttendancePercentage(dept.presentToday, dept.totalMembers)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}