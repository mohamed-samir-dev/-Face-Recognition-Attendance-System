export const calculateAttendancePercentage = (present: number, total: number): number => {
  return total > 0 ? (present / total) * 100 : 0;
};