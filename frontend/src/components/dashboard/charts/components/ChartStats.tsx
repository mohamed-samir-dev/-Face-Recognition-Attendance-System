import { TrendingUp } from "lucide-react";

interface ChartStatsProps {
  percentage: number;
  improvement: number;
}

export default function ChartStats({ percentage, improvement }: ChartStatsProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
      <div className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{percentage}%</div>
      <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 rounded-full">
        <TrendingUp className="w-3 h-3 flex-shrink-0 text-green-600" />
        <span className="text-xs text-green-600 font-semibold">+{improvement}%</span>
      </div>
    </div>
  );
}