import React from "react";
import ToggleSwitch from "./ToggleSwitch";
import { NotificationItemProps } from "../../types";

export default function NotificationItem({
  title,
  description,
  checked,
  onChange,
  disabled = true
}: NotificationItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
      <div className="flex-1">
        <h3 className="text-xs sm:text-sm lg:text-base font-medium text-gray-900">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          {description}
        </p>
      </div>
      <ToggleSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}