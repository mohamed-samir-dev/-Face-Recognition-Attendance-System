"use client";

import { Bell } from "lucide-react";
import {NotificationBellProps}from "../../types"


export default function NotificationBell({
  pendingCount,
  showNotifications,
  onToggleNotifications,
  pendingRequests,
  onViewRequest,
}: NotificationBellProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggleNotifications}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Pending Requests</h3>
            <p className="text-sm text-gray-500">{pendingCount} new requests</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {pendingRequests.slice(0, 5).map((request) => (
              <div
                key={request.id}
                className="p-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">
                      {request.employeeName}
                    </p>
                    <p className="text-xs text-gray-500">{request.leaveType}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(request.startDate).toLocaleDateString()} -{" "}
                      {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onViewRequest(request)}
                    className="text-blue-500 text-xs hover:text-blue-700"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
            {pendingCount === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No pending requests
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}