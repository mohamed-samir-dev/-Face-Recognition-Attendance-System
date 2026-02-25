import { User } from "@/lib/types";

// Camera Types
export interface CameraState {
  isActive: boolean;
  isRecording: boolean;
  hasPermission: boolean;
  error?: string;
}

export interface RecognitionResult {
  employeeId?: string;
  employeeName?: string;
  confidence: number;
  timestamp: Date;
  success: boolean;
}

export interface CameraSettings {
  width: number;
  height: number;
  facingMode: "user" | "environment";
  frameRate: number;
}

export interface CameraControlsProps {
  cameraActive: boolean;
  attendanceMarked: boolean;
  isProcessing: boolean;
  error: string;
  exhaustedAttempts: boolean;
  attemptsRemaining: number;
  multipleFaces: boolean;
  mode: string;
  onStartCamera: () => void;
  onCaptureAndDetect: () => void;
  onCheckOut: () => void;
  onRetry: () => void;
}

export interface CameraPreviewProps {
  cameraActive: boolean;
  isProcessing: boolean;
  attendanceMarked: boolean;
  recognizedUser?: User | null;
  error: string;
  exhaustedAttempts: boolean;
  attemptsRemaining: number;
  multipleFaces: boolean;
  checkedOut?: boolean;
  checkOutData?: {
    name: string;
    checkIn: string;
    checkOut: string;
    workedHours: number;
  } | null;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  username?: string;
  numericId?: number;
  password?: string;
  photoUrl?: string;
  phone?: string;
  address?: string;
  salary?: number;
  hireDate?: string;
}

export interface EmployeeInfoDisplayProps {
  employee: Employee;
}

export interface CameraLayoutProps {
  user: User;
  children: React.ReactNode;
}

export interface RecognizedEmployee {
  id: string;
  name: string;
}

export interface AuthenticationStatusProps {
  recognizedEmployee: RecognizedEmployee | null;
}
export interface CameraSectionProps {
  cameraActive: boolean;
  isProcessing: boolean;
  attendanceMarked: boolean;
  recognizedUser: User | null;
  error: string;
  exhaustedAttempts: boolean;
  attemptsRemaining: number;
  multipleFaces: boolean;
  checkedOut: boolean;
  checkOutData: {
    name: string;
    checkIn: string;
    checkOut: string;
    workedHours: number;
  } | null;
}
export interface ControlsSectionProps {
  cameraActive: boolean;
  attendanceMarked: boolean;
  isProcessing: boolean;
  detecting: boolean;
  error: string;
  exhaustedAttempts: boolean;
  attemptsRemaining: number;
  multipleFaces: boolean;
  mode: string;
  onStartCamera: () => Promise<void>;
  onCaptureAndDetect: () => Promise<void>;
  onCheckOut: () => Promise<void>;
  onRetry: () => void;
}

export interface EmployeeSectionProps {
  attendanceMarked: boolean;
  recognizedEmployee: User | null;
}
export interface CameraContentProps {
  cameraActive: boolean;
  isProcessing: boolean;
  attendanceMarked: boolean;
  recognizedUser: User | null;
  recognizedEmployee: User | null;
  error: string;
  attemptsRemaining: number;
  exhaustedAttempts: boolean;
  multipleFaces: boolean;
  detecting: boolean;
  mode: string;
  checkedOut: boolean;
  checkOutData: {
    name: string;
    checkIn: string;
    checkOut: string;
    workedHours: number;
  } | null;
  onStartCamera: () => Promise<void>;
  onCaptureAndDetect: () => Promise<void>;
  onCheckOut: () => Promise<void>;
  onRetry: () => void;
}