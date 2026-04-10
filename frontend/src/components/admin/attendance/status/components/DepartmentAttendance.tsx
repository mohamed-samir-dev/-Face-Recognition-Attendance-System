import { DepartmentAttendanceProps } from '../../types';
import { calculateAttendancePercentage } from '../shared';

export default function DepartmentAttendance({ departmentStats }: DepartmentAttendanceProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Department Attendance</h3>
      <div className="space-y-2 sm:space-y-3">
        {departmentStats.map((dept) => (
          <div key={dept.department} className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-700 truncate mr-2">{dept.department}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs sm:text-sm text-gray-500">{dept.presentToday}/{dept.totalMembers}</span>
              <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
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