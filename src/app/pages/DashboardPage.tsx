import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  Percent, BedDouble, DollarSign, TrendingUp, XCircle, ExternalLink, BarChart2,
} from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { KPICard } from '../components/dashboard/KPICard';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { ForecastChart } from '../components/dashboard/ForecastChart';
import { PickupChart } from '../components/dashboard/PickupChart';
import { FinancialComparisonChart } from '../components/dashboard/FinancialComparisonChart';
import { useDashboard } from '../hooks/useDashboard';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { useUserStore } from '../stores/useUserStore';
import { formatCurrency, formatPercent } from '../lib/utils';

export default function DashboardPage() {
  const { role, xeroConnected } = useUserStore();
  const navigate = useNavigate();
  const { data, isLoading, error, lastRefresh, refetch, acknowledgeAlert } = useDashboard();

  useAutoRefresh(refetch, 5 * 60 * 1000);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const showFinancials = role === 'owner' || role === 'manager';

  const sectionLabel = (text: string) => (
    <p className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: 'var(--vzir-text-3)' }}>
      {text}
    </p>
  );

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--vzir-bg)' }}>
      <TopBar
        title="Executive Overview"
        lastRefresh={lastRefresh}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />

      <div className="px-6 py-6 space-y-8 pb-12">

        {/* KPI Row */}
        {showFinancials && (
          <section>
            {sectionLabel("Today's Performance")}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <KPICard
                title="Occupancy"
                value={isLoading ? '—' : formatPercent(data?.kpis.occupancyToday ?? 0)}
                trend={data?.kpis.occupancyTrend}
                trendLabel="%"
                loading={isLoading}
                icon={<Percent size={14} />}
                accent="#7C3AED"
              />
              <KPICard
                title="ADR"
                value={isLoading ? '—' : formatCurrency(data?.kpis.adrToday ?? 0)}
                trend={data?.kpis.adrTrend}
                trendLabel=""
                loading={isLoading}
                icon={<DollarSign size={14} />}
                accent="#7C3AED"
              />
              <KPICard
                title="RevPAR"
                value={isLoading ? '—' : formatCurrency(data?.kpis.revpar ?? 0)}
                trend={data?.kpis.revparTrend}
                trendLabel=""
                loading={isLoading}
                icon={<TrendingUp size={14} />}
                accent="#0EA5E9"
              />
              <KPICard
                title="Rooms Available"
                value={isLoading ? '—' : `${data?.kpis.roomsAvailable ?? 0} / ${data?.kpis.totalRooms ?? 0}`}
                loading={isLoading}
                icon={<BedDouble size={14} />}
                accent="#F59E0B"
              />
              <KPICard
                title="Cancellation Rate"
                value={isLoading ? '—' : formatPercent(data?.kpis.cancellationRate ?? 0)}
                trend={data?.kpis.cancellationRateTrend}
                trendLabel="%"
                trendInverse
                loading={isLoading}
                icon={<XCircle size={14} />}
                accent="#EF4444"
              />
            </div>
          </section>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="rounded-2xl p-5 border text-center" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--vzir-text-2)' }}>{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: 'var(--vzir-primary)', color: '#fff' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Alerts */}
        <section>
          <AlertsPanel alerts={data?.alerts ?? []} loading={isLoading} onAcknowledge={acknowledgeAlert} />
        </section>

        {/* Charts */}
        {showFinancials && (
          <section>
            {sectionLabel('7-Day Forecast & Pickup')}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <ForecastChart data={data?.forecast ?? []} loading={isLoading} />
              <PickupChart data={data?.pickup ?? []} loading={isLoading} />
            </div>
          </section>
        )}

        {/* Financial Comparison — Xero-gated */}
        {showFinancials && xeroConnected && (
          <section>
            {sectionLabel('Financial Comparison')}
            <FinancialComparisonChart />
          </section>
        )}

        {/* Xero upsell nudge */}
        {showFinancials && !xeroConnected && role === 'owner' && (
          <div
            className="rounded-2xl border px-5 py-4 flex items-center justify-between gap-4"
            style={{ backgroundColor: 'rgba(124,58,237,0.04)', borderColor: 'rgba(124,58,237,0.20)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(124,58,237,0.10)' }}
              >
                <BarChart2 size={16} style={{ color: '#7C3AED' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--vzir-text)' }}>
                  Unlock financial comparison dashboards
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--vzir-text-2)' }}>
                  Connect Xero to view revenue vs budget, P&amp;L summaries and 6-month trend charts.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/integrations')}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ backgroundColor: '#7C3AED', color: '#fff' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5B21B6')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7C3AED')}
            >
              <ExternalLink size={11} />
              Connect Xero
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
