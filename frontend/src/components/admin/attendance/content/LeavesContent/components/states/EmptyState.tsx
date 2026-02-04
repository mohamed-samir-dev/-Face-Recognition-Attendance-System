import { Calendar } from "lucide-react";

export default function EmptyState() {
  return (
    <tr>
      <td colSpan={5} className="px-6 py-16 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 font-medium">No leave requests found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
      </td>
    </tr>
  );
}