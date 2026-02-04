import { DepartmentStats } from "../../types";

export const findLargestDepartment = (
  stats: DepartmentStats[]
): DepartmentStats => {
  return stats.reduce(
    (prev, current) =>
      prev.employeeCount > current.employeeCount ? prev : current,
    stats[0]
  );
};

export const findHighestBudgetDepartment = (
  stats: DepartmentStats[]
): DepartmentStats => {
  return stats.reduce(
    (prev, current) =>
      (prev.department.budget || 0) > (current.department.budget || 0)
        ? prev
        : current,
    stats[0]
  );
};
