import { RefreshCw, Menu } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { useUserStore } from '../../stores/useUserStore';
import { cn } from '../../lib/utils';

interface TopBarProps {
  title: string;
  lastRefresh?: Date | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onMenuClick?: () => void;
}

export function TopBar({
  title,
  lastRefresh,
  onRefresh,
  isRefreshing = false,
  onMenuClick,
}: TopBarProps) {
  const { pmsDataHealth } = useUserStore();

  const healthConfig = {
    healthy: { label: 'Live', color: '#10B981', bg: 'rgba(16,185,129,0.08)', dot: '#10B981' },
    delayed: { label: 'Delayed', color: '#D97706', bg: 'rgba(217,119,6,0.08)', dot: '#D97706' },
    error: { label: 'Error', color: '#DC2626', bg: 'rgba(220,38,38,0.08)', dot: '#DC2626' },
  };

  const health = healthConfig[pmsDataHealth];

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 border-b"
      style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-md transition-colors"
          style={{ color: 'var(--vzir-text-3)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--vzir-surface-2)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Menu size={18} />
        </button>
        <h1 className="text-base" style={{ color: 'var(--vzir-text)', fontWeight: 600 }}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Data health badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: health.bg, color: health.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: health.dot }} />
          {health.label}
        </div>

        {/* Last refresh */}
        {lastRefresh && (
          <span className="hidden lg:block text-xs" style={{ color: 'var(--vzir-text-3)' }}>
            Updated {formatDateTime(lastRefresh.toISOString())}
          </span>
        )}

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
            style={{
              backgroundColor: 'var(--vzir-surface-2)',
              color: 'var(--vzir-text-2)',
              border: '1px solid var(--vzir-border)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--vzir-border-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--vzir-border)')}
          >
            <RefreshCw
              size={12}
              className={cn('transition-all', isRefreshing && 'animate-spin')}
            />
            Refresh
          </button>
        )}
      </div>
    </header>
  );
}
