"use client";

import { BarChart3, Calendar, FileText, Settings, Users, Building } from "lucide-react";
import NavigationItem from "./NavigationItem";
import {AdminNavigationMenuProps}from "../../types"

export default function NavigationMenu({ activeTab, onTabChange, pendingCount }: AdminNavigationMenuProps) {
  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "Attendance", label: "Attendance", icon: Calendar },
    { id: "Leaves", label: "Leaves", icon: FileText, badge: pendingCount },
    { id: "Reports", label: "Reports", icon: FileText },
    { id: "UserManagement", label: "User Management", icon: Users },
    { id: "Departments", label: "Departments", icon: Building },
    { id: "Settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="mt-6">
      {navItems.map((item) => (
        <NavigationItem
          key={item.id}
          id={item.id}
          label={item.label}
          icon={item.icon}
          badge={item.badge}
          isActive={activeTab === item.id}
          onClick={onTabChange}
        />
      ))}
    </nav>
  );
}