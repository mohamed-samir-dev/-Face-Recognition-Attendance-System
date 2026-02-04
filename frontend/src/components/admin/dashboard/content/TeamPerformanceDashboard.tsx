"use client";

import LoadingState from "../ui/LoadingState";
import { useDashboardData } from "../hooks/useDashboardData";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardContent from "./components/DashboardContent";

export default function TeamPerformanceDashboard() {
  const { loading, selectedDepartment, setSelectedDepartment, currentStats } =
    useDashboardData();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <DashboardLayout>
      <DashboardContent
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        currentStats={currentStats}
      />
    </DashboardLayout>
  );
}
