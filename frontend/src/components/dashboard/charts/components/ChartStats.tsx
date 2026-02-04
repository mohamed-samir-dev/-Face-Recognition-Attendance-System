import { TrendingUp } from "lucide-react";

interface ChartStatsProps {
  percentage: number;
  improvement: number;
}

export default function ChartStats({ percentage, improvement }: ChartStatsProps) {
  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className="text-3xl font-bold text-[#1A1A1A]">{percentage}%</div>
      <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
        <TrendingUp className="w-3 h-3 text-green-600" />
        <span className="text-xs text-green-600 font-semibold">+{improvement}%</span>
      </div>
    </div>
  );
}