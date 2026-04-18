import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  trendInverse?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  accent?: string;
}

export function KPICard({
  title,
  value,
  trend,
  trendLabel,
  trendInverse = false,
  loading = false,
  icon,
  accent = '#7C3AED',
}: KPICardProps) {
  const getTrendInfo = () => {
    if (trend === undefined || trend === null) return null;
    const isPositive = trendInverse ? trend < 0 : trend > 0;
    const isNegative = trendInverse ? trend > 0 : trend < 0;
    if (isPositive)
      return { icon: <TrendingUp size={11} />, color: '#10B981', bg: 'rgba(16,185,129,0.08)', label: `+${Math.abs(trend).toFixed(1)}${trendLabel ?? ''}` };
    if (isNegative)
      return { icon: <TrendingDown size={11} />, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', label: `-${Math.abs(trend).toFixed(1)}${trendLabel ?? ''}` };
    return { icon: <Minus size={11} />, color: '#94A3B8', bg: 'rgba(148,163,184,0.08)', label: `${Math.abs(trend).toFixed(1)}${trendLabel ?? ''}` };
  };

  const trendInfo = getTrendInfo();

  if (loading) {
    return (
      <div className="rounded-2xl p-5 border animate-pulse" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
        <div className="h-3 w-20 rounded mb-4" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
        <div className="h-7 w-28 rounded mb-3" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
        <div className="h-3 w-16 rounded" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 border transition-all duration-200 hover:shadow-sm"
      style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--vzir-border-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--vzir-border)')}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--vzir-text-3)', fontWeight: 500 }}>
          {title}
        </p>
        {icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}14` }}>
            <span style={{ color: accent }}>{icon}</span>
          </div>
        )}
      </div>
      <p className="text-2xl mb-2" style={{ color: 'var(--vzir-text)', fontWeight: 700, letterSpacing: '-0.02em' }}>
        {value}
      </p>
      {trendInfo && (
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ backgroundColor: trendInfo.bg }}
        >
          <span style={{ color: trendInfo.color }}>{trendInfo.icon}</span>
          <span className="text-xs font-medium" style={{ color: trendInfo.color }}>
            {trendInfo.label}
          </span>
          <span className="text-xs" style={{ color: 'var(--vzir-text-3)' }}>vs yesterday</span>
        </div>
      )}
    </div>
  );
}
