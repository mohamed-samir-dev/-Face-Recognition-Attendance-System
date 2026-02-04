import { LeaveRequest } from "../../types";

export function useFilteredRequests(
  leaveRequests: LeaveRequest[],
  searchQuery: string,
  statusFilter: string
) {
  return leaveRequests
    .filter(request => {
      const matchesSearch = request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.leaveType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All Request" || 
        (statusFilter === "Approve" && request.status === "Approved") ||
        (statusFilter === "Expired" && new Date(request.endDate) < new Date() && request.status === 'Approved') ||
        request.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const statusOrder = { "Pending": 0, "Approved": 1, "Rejected": 2 };
      return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    });
}