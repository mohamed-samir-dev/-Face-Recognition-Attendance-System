import { LeaveRequest } from "../../types";

export function useTabCounts(leaveRequests: LeaveRequest[]) {
  const getTabCount = (tab: string) => {
    switch (tab) {
      case "All Request":
        return leaveRequests.length;
      case "Pending":
        return leaveRequests.filter(r => r.status === 'Pending').length;
      case "Approve":
        return leaveRequests.filter(r => r.status === 'Approved').length;
      case "Rejected":
        return leaveRequests.filter(r => r.status === 'Rejected').length;
      case "Expired":
        return leaveRequests.filter(r => new Date(r.endDate) < new Date() && r.status === 'Approved').length;
      default:
        return 0;
    }
  };

  const getBadgeColor = (tab: string) => {
    switch (tab) {
      case "Pending":
        return "bg-orange-200 text-orange-800";
      case "Approve":
        return "bg-green-200 text-green-800";
      case "Rejected":
        return "bg-red-200 text-red-800";
      case "Expired":
        return "bg-purple-200 text-purple-800";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return { getTabCount, getBadgeColor };
}