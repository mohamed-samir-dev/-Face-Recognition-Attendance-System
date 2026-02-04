export interface EmailCredentials {
    name: string;
    email: string;
    username: string;
    password: string;
    accountType: string;
    department: string;
    jobTitle: string;
    supervisor?: string;
  }
  
 export  interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    photoUrl?: string;
    phone?: string;
    address?: string;
    salary?: number;
    hireDate?: string;
  }
  
  export interface FaceComparisonResult {
    success: boolean;
    employee?: Employee;
    message: string;
  }
  
  export  interface LeaveDaysRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    leaveRequestId: string;
    leaveDays: number;
    leaveType: string;
    startDate: string;
    endDate: string;
    approvedAt: string;
  }
  export interface Notification {
    id: string;
    employeeId: string;
    message: string;
    type: 'leave_approved' | 'leave_rejected' | 'leave_canceled' | 'vacation_announcement' | 'holiday_updated' | 'holiday_deleted' | 'holiday_expired' | 'working_hours_changed' | 'attendance_rules_changed' | 'attendance_reminder';
    isRead: boolean;
    createdAt: string;
  }
  
  export interface PythonAnalyticsReport {
    generated_at: string;
    budget_analysis: {
      variance: number;
      variance_percentage: number;
      utilization_rate: number;
    };
    salary_analysis: {
      mean_salary: number;
      median_salary: number;
      std_deviation: number;
      department_stats: Record<string, { mean: number; count: number }>;
    };
    expense_forecast: Array<{
      month: string;
      projected_amount: number;
      confidence: string;
    }>;
    insights: string[];
  }
  

  export interface UserSession {
    lastLogin: Date;
    isActive: boolean;
    sessionStartTime: Date;
  }
 

  export interface ThreeStepVerificationResult {
    step1_face_recognition: {
      success: boolean;
      recognized_name?: string;
      message: string;
    };
    step2_numeric_id_verification: {
      success: boolean;
      firebase_numeric_id?: number;
      expected_numeric_id?: number;
      message?: string;
    };
    overall_success: boolean;
    message?: string;
    error?: string;
  }
  

  export interface TimerData {
    userId: string;
    startTime: number;
    remaining: number;
    active: boolean;
    totalHours: number;
    actualWorkedHours?: number;
    checkInTime?: string;
  }