import React from "react";
import {ToggleSwitchProps}from "../../types"


export default function ToggleSwitch({ checked, onChange, disabled }: ToggleSwitchProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 self-start sm:self-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
        disabled={disabled}
      />
      <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );
}