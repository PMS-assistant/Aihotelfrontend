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
    healthy: { label: 'Live', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    delayed: { label: 'Delayed', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    error: { label: 'Error', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  };

  const health = healthConfig[pmsDataHealth];

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b"
      style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-md transition-colors hover:bg-slate-800"
          style={{ color: '#64748b' }}
        >
          <Menu size={18} />
        </button>
        <h1 className="text-base" style={{ color: '#f1f5f9', fontWeight: 600 }}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Data health badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
          style={{ backgroundColor: health.bg, color: health.color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: health.color }}
          />
          {health.label}
        </div>

        {/* Last refresh */}
        {lastRefresh && (
          <span className="hidden lg:block text-xs" style={{ color: '#475569' }}>
            Updated {formatDateTime(lastRefresh.toISOString())}
          </span>
        )}

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-slate-700 disabled:opacity-50"
            style={{
              backgroundColor: '#1e293b',
              color: '#94a3b8',
            }}
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