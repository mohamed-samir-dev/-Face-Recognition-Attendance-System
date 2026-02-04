import { AttendanceChartProps } from "../types";
import { LineChart, BarChart, ChartHeader, ChartStats } from "./components";

export default function AttendanceChart({ title, percentage, improvement, type }: AttendanceChartProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <ChartHeader title={title} type={type} />
      <ChartStats percentage={percentage} improvement={improvement} />
      {type === "line" ? <LineChart /> : <BarChart />}
    </div>
  );
}