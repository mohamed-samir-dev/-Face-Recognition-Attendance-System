import {
  getCompanySettings,
  getDepartmentEmployees,
} from "@/lib/services/system/settingsService";
import { DepartmentStats } from "../../types";

export const fetchDepartmentAnalytics = async () => {
  const settings = await getCompanySettings();
  const departmentStats: DepartmentStats[] = [];
  let totalEmployees = 0;
  let totalBudget = 0;

  for (const dept of settings.departments) {
    const employees = await getDepartmentEmployees(dept.name);
    const employeeCount = employees.length;
    const budgetPerEmployee =
      dept.budget && employeeCount > 0 ? dept.budget / employeeCount : 0;

    departmentStats.push({
      department: dept,
      employeeCount,
      budgetPerEmployee,
    });

    totalEmployees += employeeCount;
    totalBudget += dept.budget || 0;
  }

  return {
    departments: settings.departments,
    stats: departmentStats,
    totalEmployees,
    totalBudget,
  };
};
