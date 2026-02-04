'use client';

import { BarChart3 } from 'lucide-react';
import { 
  SummaryCards, 
  DepartmentBreakdown, 
  LoadingState, 
  EmptyState, 
  useDepartmentAnalytics 
} from '../../features/analytics';

export default function DepartmentAnalytics() {
  const {
    departments,
    stats,
    loading,
    totalEmployees,
    totalBudget,
    largestDepartment,
    highestBudgetDept
  } = useDepartmentAnalytics();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Department Analytics
        </h3>
        <p className="text-sm text-gray-600">Overview of departmental statistics and performance metrics</p>
      </div>

      <SummaryCards 
        departmentCount={departments.length}
        totalEmployees={totalEmployees}
        totalBudget={totalBudget}
      />

      {stats.length > 0 ? (
        <DepartmentBreakdown 
          stats={stats}
          totalEmployees={totalEmployees}
          largestDepartment={largestDepartment}
          highestBudgetDept={highestBudgetDept}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}