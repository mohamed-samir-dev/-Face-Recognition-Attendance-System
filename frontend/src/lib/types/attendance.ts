export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'Present' | 'Absent' | 'Late' | 'OnLeave';
  department?: string;
  workedHours?: number;
  overtimeHours?: number;
  employeeName?: string;
  timestamp?: Date;
}


