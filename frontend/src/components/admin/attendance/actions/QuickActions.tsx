import { Users, FileText } from 'lucide-react';

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Users className="w-5 h-5" />
          Manage Users
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          <FileText className="w-5 h-5" />
          View Leave Requests
        </button>
      </div>
    </div>
  );
}