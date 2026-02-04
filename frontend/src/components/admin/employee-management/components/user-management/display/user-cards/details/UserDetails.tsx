'use client';

import { User } from '@/lib/types';
// import { useUnexcusedAbsences } from '@/components/admin/employee-management/hooks/useUnexcusedAbsences';
// import { AlertTriangle } from 'lucide-react';

interface UserDetailsProps {
  user: User;
}

export default function UserDetails({ user }: UserDetailsProps) {
  // const { unexcusedAbsences, loading } = useUnexcusedAbsences(user.id);

  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Contact:</span>
        <span className="text-gray-900">{user.email || "No contact"}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Department:</span>
        <span className="text-gray-900">{user.Department || user.department || "Not Assigned"}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Job Title:</span>
        <span className="text-gray-900">{user.jobTitle || "Not Assigned"}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Salary:</span>
        <span className="text-gray-900 font-semibold">${user.salary?.toLocaleString() || "Not Set"}</span>
      </div>
      {/* <div className="flex justify-between text-sm">
        <span className="text-gray-500 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Unexcused Absences:
        </span>
        <span className={`font-semibold ${
          loading ? 'text-gray-400' : 
          unexcusedAbsences > 0 ? 'text-red-600' : 'text-green-600'
        }`}>
          {loading ? 'Loading...' : unexcusedAbsences}
        </span>
      </div> */}
    </div>
  );
}