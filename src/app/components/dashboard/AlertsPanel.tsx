import { AlertCard } from './AlertCard';
import type { AlertData } from '../../lib/mockData';
import { CheckCircle2, Bell } from 'lucide-react';

interface AlertsPanelProps {
  alerts: AlertData[];
  loading?: boolean;
  onAcknowledge?: (id: string) => Promise<void>;
}

export function AlertsPanel({ alerts, loading = false, onAcknowledge }: AlertsPanelProps) {
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-2xl p-4 border animate-pulse" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
            <div className="h-3 w-40 rounded mb-2" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
            <div className="h-3 w-full rounded mb-1" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
            <div className="h-3 w-3/4 rounded" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
          </div>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl p-6 border flex items-center gap-3" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(16,185,129,0.10)' }}>
          <CheckCircle2 size={15} style={{ color: '#10B981' }} />
        </div>
        <p className="text-sm" style={{ color: 'var(--vzir-text-2)' }}>
          No active alerts — all systems nominal.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Bell size={14} style={{ color: 'var(--vzir-text-3)' }} />
        <h2 className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--vzir-text-3)' }}>
          Active Alerts
        </h2>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.10)', color: '#DC2626' }}>
              {criticalCount} critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(245,158,11,0.10)', color: '#D97706' }}>
              {warningCount} warning
            </span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {alerts
          .sort((a, b) => ({ critical: 0, warning: 1, info: 2 }[a.severity] - { critical: 0, warning: 1, info: 2 }[b.severity]))
          .map((alert) => (
            <AlertCard key={alert.id} alert={alert} onAcknowledge={onAcknowledge} />
          ))}
      </div>
    </div>
  );
}
