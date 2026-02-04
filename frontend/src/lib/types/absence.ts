export interface AbsenceRecord {
  id: string;
  userId: string;
  employeeName: string;
  date: string;
  reason: 'Unexcused' | 'NoShow';
  createdAt: string;
}