"use client";

import { SidebarHeader, NavigationMenu } from "./sidebar";
import {AdminSidebarProps}from "../types"

export default function AdminSidebar({ activeTab, onTabChange, pendingCount, isOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <div className={`w-56 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <SidebarHeader onClose={onClose} />
        <NavigationMenu 
          activeTab={activeTab} 
          onTabChange={onTabChange} 
          pendingCount={pendingCount} 
        />
      </div>
    </>
  );
}