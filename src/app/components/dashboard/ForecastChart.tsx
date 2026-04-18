import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { ForecastPoint } from '../../lib/mockData';

interface ForecastChartProps {
  data: ForecastPoint[];
  loading?: boolean;
}

type MetricKey = 'occupancy' | 'revpar' | 'adr';

const METRICS = [
  { key: 'occupancy' as MetricKey, label: 'Occupancy %', color: '#7C3AED', format: (v: number) => `${v}%` },
  { key: 'revpar'    as MetricKey, label: 'RevPAR (£)',  color: '#10B981', format: (v: number) => `£${v}` },
  { key: 'adr'       as MetricKey, label: 'ADR (£)',     color: '#F59E0B', format: (v: number) => `£${v}` },
];

const CustomTooltip = ({
  active, payload, label,
}: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-xs shadow-lg border" style={{ backgroundColor: '#fff', borderColor: 'var(--vzir-border)' }}>
      <p className="mb-2 font-semibold" style={{ color: 'var(--vzir-text)' }}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span style={{ color: 'var(--vzir-text-2)' }}>{entry.name}:</span>
          <span className="font-semibold" style={{ color: 'var(--vzir-text)' }}>
            {entry.name === 'Occupancy %' ? `${entry.value}%` : `£${entry.value}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export function ForecastChart({ data, loading = false }: ForecastChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(new Set(['occupancy', 'revpar']));

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { if (next.size > 1) next.delete(key); }
      else next.add(key);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-5 border animate-pulse" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
        <div className="h-4 w-40 rounded mb-6" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
        <div className="h-48 w-full rounded" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--vzir-text)' }}>7-Day Forecast</h2>
        <div className="flex items-center gap-2">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => toggleMetric(m.key)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all font-medium"
              style={{
                backgroundColor: activeMetrics.has(m.key) ? `${m.color}12` : 'transparent',
                color: activeMetrics.has(m.key) ? m.color : 'var(--vzir-text-3)',
                border: `1px solid ${activeMetrics.has(m.key) ? m.color + '40' : 'var(--vzir-border)'}`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeMetrics.has(m.key) ? m.color : 'var(--vzir-border-hover)' }} />
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--vzir-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          {METRICS.filter((m) => activeMetrics.has(m.key)).map((m) => (
            <Line
              key={m.key}
              type="monotone"
              dataKey={m.key}
              name={m.label}
              stroke={m.color}
              strokeWidth={2.5}
              dot={{ r: 3, fill: m.color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: m.color, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
