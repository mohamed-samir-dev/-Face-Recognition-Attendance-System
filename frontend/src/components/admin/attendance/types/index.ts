export interface LeavesContentProps {
  searchQuery: string;
}

export interface StatusTabsProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  leaveRequests: LeaveRequest[];
}


export interface LeaveRequestsTableProps {
  leaveRequests: LeaveRequest[];
  searchQuery: string;
  statusFilter: string;
  error: string | null;
  onViewDetails: (request: LeaveRequest) => void;
  onDelete: (request: LeaveRequest) => void;
}

export interface LeaveRequestRowProps {
  request: LeaveRequest;
  onViewDetails: (request: LeaveRequest) => void;
  onDelete: (request: LeaveRequest) => void;
}

export interface ToastState {
  message: string;
  type: "success" | "error" | "warning";
  isVisible: boolean;
}

export interface ModalsContainerProps {
  isModalOpen: boolean;
  selectedRequest: LeaveRequest | null;
  isDeleteModalOpen: boolean;
  deleteRequest: LeaveRequest | null;
  onCloseModal: () => void;
  onCloseDeleteModal: () => void;
  onStatusUpdate: (requestId: string, status: "Approved" | "Rejected") => void;
  onConfirmDelete: () => void;
}

export interface StatusTabProps {
  tab: string;
  isActive: boolean;
  count: number;
  badgeColor: string;
  onClick: () => void;
}

export interface ReasonsListProps {
  absenceReasons: AbsenceReason[];
}
export interface ReasonItemProps {
  reason: AbsenceReason;
}
export interface AbsenceReasonsProps {
  absenceReasons: AbsenceReason[];
}

export interface AttendanceStatusProps {
  present: number;
  total: number;
}

export interface DepartmentAttendanceProps {
  departmentStats: DepartmentStats[];
}

export interface AttendanceGridProps {
  departmentStats: DepartmentStats[];
  absenceReasons: AbsenceReason[];
  totalStats: { present: number; total: number };
}

export  interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Vacation' | 'Sick Leave' | 'Personal Leave' | 'Maternity Leave' | 'Paternity Leave';
  startDate: string;
  endDate: string;
  leaveDays: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason?: string;
  createdAt: string;
  updatedAt: string;
  supervisorId?: string;
  supervisorName?: string;
  routeToAdmin?: boolean;
  requesterAccountType?: 'Employee' | 'Admin' | 'Manager' | 'Supervisor';
}

export interface AbsenceReason {
  reason: string;
  percentage: number;
  count: number;
}




export interface AttendanceStats {
  totalMembers: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onLeaveToday?: number;
}

export interface DepartmentStats extends AttendanceStats {
  department: string;
}
