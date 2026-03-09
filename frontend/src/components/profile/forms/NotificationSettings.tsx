import React from "react";
import { NotificationSettingsProps } from "../types";
import { NotificationList } from "./notification-settings";

export default function NotificationSettings({
  formData,
  onInputChange,
}: NotificationSettingsProps) {
  return (
    <div>
      <h2 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
        Notification Preferences
      </h2>
      <NotificationList formData={formData} onInputChange={onInputChange} />
    </div>
  );
}
