'use client';

interface DisabledFieldProps {
  label: string;
  value: string;
}

export default function DisabledField({ label, value }: DisabledFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
      />
    </div>
  );
}