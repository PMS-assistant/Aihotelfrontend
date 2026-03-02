import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Skeleton } from '../ui/skeleton';
import type { ForecastPoint } from '../../lib/mockData';

interface ForecastChartProps {
  data: ForecastPoint[];
  loading?: boolean;
}

type MetricKey = 'occupancy' | 'revpar' | 'adr';

interface MetricConfig {
  key: MetricKey;
  label: string;
  color: string;
  format: (v: number) => string;
}

const METRICS: MetricConfig[] = [
  { key: 'occupancy', label: 'Occupancy %', color: '#a78bfa', format: (v) => `${v}%` },
  { key: 'revpar', label: 'RevPAR (£)', color: '#34d399', format: (v) => `£${v}` },
  { key: 'adr', label: 'ADR (£)', color: '#60a5fa', format: (v) => `£${v}` },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg p-3 text-xs shadow-xl border"
      style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
    >
      <p className="mb-2" style={{ color: '#94a3b8', fontWeight: 500 }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span style={{ color: '#94a3b8' }}>{entry.name}:</span>
          <span style={{ color: '#f1f5f9', fontWeight: 500 }}>
            {entry.name === 'Occupancy %' ? `${entry.value}%` : `£${entry.value}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export function ForecastChart({ data, loading = false }: ForecastChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(
    new Set(['occupancy', 'revpar'])
  );

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div
        className="rounded-xl p-5 border"
        style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
      >
        <Skeleton className="h-4 w-40 mb-6" style={{ backgroundColor: '#334155' }} />
        <Skeleton className="h-48 w-full" style={{ backgroundColor: '#334155' }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5 border"
      style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
    >
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-sm" style={{ color: '#f1f5f9', fontWeight: 600 }}>
          7-Day Forecast
        </h2>
        <div className="flex items-center gap-2">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => toggleMetric(m.key)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all"
              style={{
                backgroundColor: activeMetrics.has(m.key) ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeMetrics.has(m.key) ? m.color : '#475569',
                border: `1px solid ${activeMetrics.has(m.key) ? m.color + '40' : '#334155'}`,
                fontWeight: 500,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: activeMetrics.has(m.key) ? m.color : '#475569' }}
              />
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#1e3a5f" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {METRICS.filter((m) => activeMetrics.has(m.key)).map((m) => (
            <Line
              key={m.key}
              type="monotone"
              dataKey={m.key}
              name={m.label}
              stroke={m.color}
              strokeWidth={2}
              dot={{ r: 3, fill: m.color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: m.color, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
