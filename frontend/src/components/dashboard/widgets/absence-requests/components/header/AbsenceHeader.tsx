import { Calendar } from "lucide-react";

interface AbsenceHeaderProps {
  approvedCount: number;
}

export function AbsenceHeader({ approvedCount }: AbsenceHeaderProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
      <div className="p-1.5 sm:p-2 rounded-full bg-linear-to-r from-purple-50 to-purple-100 border-purple-200 shrink-0">
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
      </div>
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-[#555]">
          Absence Requests
        </h4>
        <div className="text-xl sm:text-2xl font-bold text-gray-800 mt-0.5 sm:mt-1">
          {approvedCount}
        </div>
      </div>
    </div>
  );
}