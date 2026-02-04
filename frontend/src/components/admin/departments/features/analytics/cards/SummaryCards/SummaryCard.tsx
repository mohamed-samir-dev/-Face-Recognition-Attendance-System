import { SummaryCardProps } from '../../../../types';

export default function SummaryCard({ icon: Icon, title, value, colorClass }: SummaryCardProps) {
  return (
    <div className={`${colorClass} p-4 rounded-lg border`}>
      <div className="flex items-center gap-3">
        <Icon className="w-8 h-8" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}