import { AttendanceSummaryProps } from '../types';
import SummaryHeader from './components/SummaryHeader';
import MetricsGrid from './components/MetricsGrid';

export default function AttendanceSummary({ stats }: AttendanceSummaryProps) {
  return (
    <>
      <SummaryHeader />
      <MetricsGrid stats={stats} />
    </>
  );
}