"use client";

import { useState } from "react";
import { AttendanceChartProps } from "../types";
import { LineChart, BarChart, ChartHeader, ChartStats, MonthDetailsModal } from "./components";

interface AttendanceChartPropsExtended extends AttendanceChartProps {
  dailyData?: { day: number; status: number }[];
  monthlyData?: { month: string; attendance: number }[];
  monthlyDetails?: Map<string, {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    attendanceRate: number;
  }>;
}

export default function AttendanceChart({ 
  title, 
  percentage, 
  improvement, 
  type,
  dailyData = [],
  monthlyData = [],
  monthlyDetails
}: AttendanceChartPropsExtended) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const handleBarClick = (month: string) => {
    setSelectedMonth(month);
  };

  const getMonthDetails = () => {
    if (!selectedMonth || !monthlyDetails) return null;
    const details = monthlyDetails.get(selectedMonth);
    if (!details) return null;
    return {
      month: selectedMonth,
      ...details
    };
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
        <ChartHeader title={title} type={type} />
        <ChartStats percentage={percentage} improvement={improvement} />
        {type === "line" ? (
          <LineChart data={dailyData} />
        ) : (
          <BarChart data={monthlyData} onBarClick={handleBarClick} />
        )}
      </div>

      <MonthDetailsModal
        isOpen={selectedMonth !== null}
        onClose={() => setSelectedMonth(null)}
        monthData={getMonthDetails()}
      />
    </>
  );
}