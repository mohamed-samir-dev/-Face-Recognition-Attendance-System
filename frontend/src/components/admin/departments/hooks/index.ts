"use client";

import { useState, useEffect } from "react";
import { Department } from "../types";
import { DepartmentStats, DepartmentAnalyticsReturn } from "../types";
import { fetchDepartmentAnalytics } from "./data/dataFetcher";
import { findLargestDepartment, findHighestBudgetDepartment } from "./utils/utils";

export function useDepartmentAnalytics(): DepartmentAnalyticsReturn {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<DepartmentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await fetchDepartmentAnalytics();
      setDepartments(data.departments);
      setStats(data.stats);
      setTotalEmployees(data.totalEmployees);
      setTotalBudget(data.totalBudget);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const largestDepartment =
    stats.length > 0 ? findLargestDepartment(stats) : stats[0];
  const highestBudgetDept =
    stats.length > 0 ? findHighestBudgetDepartment(stats) : stats[0];

  return {
    departments,
    stats,
    loading,
    totalEmployees,
    totalBudget,
    largestDepartment,
    highestBudgetDept,
  };
}

// Re-export types for convenience
export type { DepartmentStats } from "../types";
