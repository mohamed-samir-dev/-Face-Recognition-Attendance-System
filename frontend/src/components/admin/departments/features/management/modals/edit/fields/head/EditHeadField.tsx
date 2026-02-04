'use client';

import {EditHeadFieldProps}from "../../../../../../types"
export default function EditHeadField({ headId, users, onChange }: EditHeadFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Department Head
      </label>
      <select
        value={headId || ""}
        onChange={(e) => {
          const selectedUser = users.find((user) => user.id === e.target.value);
          onChange(e.target.value, selectedUser ? selectedUser.name : "");
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      >
        <option value="">Select department head</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}