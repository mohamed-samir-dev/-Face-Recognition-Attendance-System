// Employee Management
export * from './employee-management/forms';
export * from './employee-management/views';
export * from './employee-management/modals';
export * from './employee-management/hooks';
export {
  BasicInfoFields,
  EditFormFields,
  PhotoUploadSection,
  FacialDataSection,
  UserFilters,
  UserTable,
  UserCards,
  AssignmentForm,
  SearchBar,
  UnassignedUsers,
  DepartmentList,
  LoadingState as EmployeeManagementLoadingState,
  UserManagementLoadingState,
  AssignmentLoadingState
} from './employee-management/components';

// Attendance
export * from './attendance';
export type { DepartmentStats as AttendanceDepartmentStats } from './attendance/types';

// Dashboard
export { 
  DashboardContent, 
  TeamPerformanceDashboard,
  DashboardHeader,
  AttendanceSummary,
  DepartmentSelector,
  LoadingState as DashboardLoadingState
} from './dashboard';

// Departments
export { 
  DepartmentAnalytics, 
  DepartmentManagement, 
  DepartmentsContent,
  UserDepartmentAssignment
} from './departments';
export type { DepartmentStats as DepartmentsDepartmentStats } from './departments/types';
export * from './departments/utils';
export { 
  SummaryCards, 
  DepartmentBreakdown, 
  LoadingState as AnalyticsLoadingState, 
  EmptyState, 
  useDepartmentAnalytics 
} from './departments/features/analytics';
export * from './departments/features/management';
export { PageHeader, useDepartmentsContent, LoadingState as DepartmentsLoadingState } from './departments/features/content';

// Reports
export * from './reports';

// Settings
export * from './settings';