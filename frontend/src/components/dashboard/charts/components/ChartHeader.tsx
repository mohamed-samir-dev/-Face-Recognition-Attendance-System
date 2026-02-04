import { Activity, BarChart3 } from "lucide-react";

interface ChartHeaderProps {
  title: string;
  type: "line" | "bar";
}

export default function ChartHeader({ title, type }: ChartHeaderProps) {
  const getIcon = () => {
    return type === "line" ? <Activity className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />;
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-base font-bold text-[#1A1A1A]">
        {title}
      </h4>
      <div className="p-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
        <div className="text-blue-600">
          {getIcon()}
        </div>
      </div>
    </div>
  );
}