export default function TableHeader() {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Leave Type</th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Dates</th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
      </tr>
    </thead>
  );
}