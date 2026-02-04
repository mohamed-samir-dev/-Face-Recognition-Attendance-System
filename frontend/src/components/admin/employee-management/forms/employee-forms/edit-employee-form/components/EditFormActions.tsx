"use client";

import { useRouter, usePathname } from 'next/navigation';

interface EditFormActionsProps {
  loading: boolean;
}

export default function EditFormActions({ loading }: EditFormActionsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleCancel = () => {
    const redirectPath = pathname?.includes('/supervisor') ? '/supervisor?tab=UserManagement' : '/admin?tab=UserManagement';
    router.push(redirectPath);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 lg:pt-6">
      <button
        type="button"
        onClick={handleCancel}
        className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}