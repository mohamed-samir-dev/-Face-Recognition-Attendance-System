import React from "react";
import NotificationItem from "./NotificationItem";
import {NotificationListProps}from"../../types"

export default function NotificationList({ formData, onInputChange }: NotificationListProps) {
  const notifications = [
    {
      key: "attendanceReminders",
      title: "Attendance Reminders",
      description: "Receive reminders to clock in and out.",
      checked: formData.attendanceReminders
    },
    {
      key: "leaveStatusUpdates",
      title: "Leave Status Updates",
      description: "Get notified when your leave requests are approved or rejected.",
      checked: formData.leaveStatusUpdates
    },
    {
      key: "systemAnnouncements",
      title: "System Announcements",
      description: "Receive notifications about system updates and maintenance.",
      checked: formData.systemAnnouncements
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.key}
          title={notification.title}
          description={notification.description}
          checked={notification.checked}
          onChange={(checked) => onInputChange(notification.key, checked)}
        />
      ))}
    </div>
  );
}