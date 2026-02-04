"use client";


import {URLInputProps}from "../../../../../types"

export default function URLInput({ formData, setFormData }: URLInputProps) {
  return (
    <input
      type="url"
      value={formData.image}
      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black mb-4"
    />
  );
}