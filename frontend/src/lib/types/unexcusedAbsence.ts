export interface UnexcusedAbsence {
  id: string;
  userId: string;
  employeeName: string;
  date: string;
  penaltyDays: number;
  reason: string;
  createdAt: string;
  status: 'Active' | 'Resolved';
}
