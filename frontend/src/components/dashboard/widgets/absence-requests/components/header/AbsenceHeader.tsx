import { Calendar } from "lucide-react";

interface AbsenceHeaderProps {
  approvedCount: number;
}

export function AbsenceHeader({ approvedCount }: AbsenceHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
        <Calendar className="w-5 h-5 text-purple-600" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[#555]">
          Absence Requests
        </h4>
        <div className="text-2xl font-bold text-gray-800 mt-1">
          {approvedCount}
        </div>
      </div>
    </div>
  );
}