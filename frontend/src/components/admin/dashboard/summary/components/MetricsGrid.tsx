import MetricCard from '@/components/common/cards/MetricCard';
import { METRIC_CONFIGS } from '../constants/metrics';
import {MetricsGridProps}from "../../types"

export default function MetricsGrid({ stats }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {METRIC_CONFIGS.map((config) => (
        <MetricCard
          key={config.key}
          title={config.title}
          value={stats?.[config.key as keyof typeof stats] || 0}
          icon={config.icon}
          color={config.color}
        />
      ))}
    </div>
  );
}