"use client";

import { useState, useEffect } from "react";
import { Users, UserCheck, UserX, Calendar } from "lucide-react";
import { User } from "@/lib/types";
import { getUsers } from "@/lib/services/user/userService";
import { getTodayAttendance } from "@/lib/services/attendance/attendanceService";
import { getLeaveRequests } from "@/lib/services/leave/leaveService";

interface SupervisorDashboardProps {
  user: User;
}

interface DashboardStats {
  totalEmployees: number;
  presentEmployees: number;
  absentEmployees: number;
  onLeaveEmployees: number;
}

export default function SupervisorDashboard({ user }: SupervisorDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentEmployees: 0,
    absentEmployees: 0,
    onLeaveEmployees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      const [allUsers, todayAttendance, leaveRequests] = await Promise.all([
        getUsers(),
        getTodayAttendance(),
        getLeaveRequests(),
      ]);

      // Get employees in supervisor's department (excluding the supervisor)
      const departmentEmployees = allUsers.filter(
        (u) =>
          u.department === user.department &&
          u.accountType === "Employee" &&
          u.id !== user.id
      );

      const totalEmployees = departmentEmployees.length;

      // Get employees on approved leave today
      const today = new Date().toISOString().split("T")[0];
      const approvedLeaves = leaveRequests.filter(
        (req) =>
          req.status === "Approved" &&
          req.startDate <= today &&
          req.endDate >= today
      );

      const employeesOnLeave = departmentEmployees.filter((emp) =>
        approvedLeaves.some(
          (leave) =>
            leave.employeeId === emp.id ||
            leave.employeeId === emp.numericId?.toString()
        )
      ).length;

      // Get present employees (those who marked attendance today)
      const presentEmployeeIds = new Set(
        todayAttendance
          .filter((record) =>
            departmentEmployees.some((emp) => emp.id === record.userId)
          )
          .map((record) => record.userId)
      );
      const presentEmployees = presentEmployeeIds.size;

      // Calculate absent employees (total - present - on leave)
      const absentEmployees = totalEmployees - presentEmployees - employeesOnLeave;

      setStats({
        totalEmployees,
        presentEmployees,
        absentEmployees,
        onLeaveEmployees: employeesOnLeave,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Present Today",
      value: stats.presentEmployees,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Absent Today",
      value: stats.absentEmployees,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "On Leave",
      value: stats.onLeaveEmployees,
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}