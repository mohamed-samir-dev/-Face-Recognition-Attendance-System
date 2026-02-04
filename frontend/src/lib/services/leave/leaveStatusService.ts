import { getLeaveRequests } from "./leaveService";

export const isEmployeeOnLeave = async (employeeId: string): Promise<boolean> => {
  try {
    const leaveRequests = await getLeaveRequests();
    const today = new Date().toISOString().split('T')[0];
    
    return leaveRequests.some(request => 
      request.employeeId === employeeId &&
      request.status === 'Approved' &&
      request.startDate <= today &&
      request.endDate >= today
    );
  } catch (error) {
    console.error("Error checking leave status:", error);
    return false;
  }
};