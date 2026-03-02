import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  trendInverse?: boolean;
  loading?: boolean;
}

export function KPICard({
  title,
  value,
  trend,
  trendLabel,
  trendInverse = false,
  loading = false,
}: KPICardProps) {
  const getTrendInfo = () => {
    if (trend === undefined || trend === null) return null;
    const isPositive = trendInverse ? trend < 0 : trend > 0;
    const isNegative = trendInverse ? trend > 0 : trend < 0;

    if (isPositive)
      return { icon: <TrendingUp size={12} />, color: '#22c55e', label: `+${Math.abs(trend).toFixed(1)}${trendLabel ?? ''}` };
    if (isNegative)
      return { icon: <TrendingDown size={12} />, color: '#ef4444', label: `-${Math.abs(trend).toFixed(1)}${trendLabel ?? ''}` };
    return { icon: <Minus size={12} />, color: '#64748b', label: `${Math.abs(trend).toFixed(1)}${trendLabel ?? ''}` };
  };

  const trendInfo = getTrendInfo();

  if (loading) {
    return (
      <div
        className="rounded-xl p-5 border"
        style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
      >
        <Skeleton className="h-3 w-24 mb-4" style={{ backgroundColor: '#334155' }} />
        <Skeleton className="h-7 w-32 mb-3" style={{ backgroundColor: '#334155' }} />
        <Skeleton className="h-3 w-16" style={{ backgroundColor: '#334155' }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5 border transition-all duration-200 hover:border-slate-600"
      style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
    >
      <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#64748b', fontWeight: 500 }}>
        {title}
      </p>
      <p className="text-2xl mb-2" style={{ color: '#f1f5f9', fontWeight: 600, letterSpacing: '-0.02em' }}>
        {value}
      </p>
      {trendInfo && (
        <div className="flex items-center gap-1.5">
          <span style={{ color: trendInfo.color }}>{trendInfo.icon}</span>
          <span className="text-xs" style={{ color: trendInfo.color, fontWeight: 500 }}>
            {trendInfo.label}
          </span>
          <span className="text-xs" style={{ color: '#475569' }}>
            vs yesterday
          </span>
        </div>
      )}
    </div>
  );
}
