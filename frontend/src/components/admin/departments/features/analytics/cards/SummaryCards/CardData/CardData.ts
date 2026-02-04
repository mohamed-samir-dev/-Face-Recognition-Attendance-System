import { Users, TrendingUp, Building, DollarSign } from 'lucide-react';

export const createCardData = (departmentCount: number, totalEmployees: number, totalBudget: number) => {
  const avgEmployeesPerDept = departmentCount > 0 ? Math.round(totalEmployees / departmentCount) : 0;

  return [
    {
      icon: Building,
      title: 'Total Departments',
      value: departmentCount,
      colorClass: 'bg-blue-50 border-blue-200 text-blue-600 [&_p:last-child]:text-blue-900'
    },
    {
      icon: Users,
      title: 'Total Employees',
      value: totalEmployees,
      colorClass: 'bg-green-50 border-green-200 text-green-600 [&_p:last-child]:text-green-900'
    },
    {
      icon: DollarSign,
      title: 'Total Budget',
      value: `$${totalBudget.toLocaleString()}`,
      colorClass: 'bg-purple-50 border-purple-200 text-purple-600 [&_p:last-child]:text-purple-900'
    },
    {
      icon: TrendingUp,
      title: 'Avg. Employees/Dept',
      value: avgEmployeesPerDept,
      colorClass: 'bg-orange-50 border-orange-200 text-orange-600 [&_p:last-child]:text-orange-900'
    }
  ];
};