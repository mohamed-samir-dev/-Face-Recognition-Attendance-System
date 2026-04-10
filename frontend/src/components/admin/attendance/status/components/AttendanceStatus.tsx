import CircularProgress from '@/components/common/ui/CircularProgress';
import { AttendanceStatusProps } from '../../types';

export default function AttendanceStatus({ present, total }: AttendanceStatusProps) {
  const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Attendance Status</h3>
      <div className="flex justify-center">
        <CircularProgress 
          percentage={presentPercentage}
          total={total}
          present={present}
        />
      </div>
    </div>
  );
}