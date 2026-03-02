import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Skeleton } from '../ui/skeleton';
import type { PickupPoint } from '../../lib/mockData';

interface PickupChartProps {
  data: PickupPoint[];
  loading?: boolean;
}

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
          <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{entry.value} rooms</span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = () => (
  <div className="flex items-center justify-end gap-4 mb-4">
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#7c3aed' }} />
      <span className="text-xs" style={{ color: '#94a3b8' }}>This week</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#334155' }} />
      <span className="text-xs" style={{ color: '#94a3b8' }}>Last week</span>
    </div>
  </div>
);

export function PickupChart({ data, loading = false }: PickupChartProps) {
  if (loading) {
    return (
      <div
        className="rounded-xl p-5 border"
        style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
      >
        <Skeleton className="h-4 w-48 mb-6" style={{ backgroundColor: '#334155' }} />
        <Skeleton className="h-48 w-full" style={{ backgroundColor: '#334155' }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5 border"
      style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm" style={{ color: '#f1f5f9', fontWeight: 600 }}>
          Pickup Pace Comparison
        </h2>
        <span className="text-xs" style={{ color: '#475569' }}>
          Room nights booked / day
        </span>
      </div>
      <CustomLegend />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={3}>
          <CartesianGrid stroke="#1e3a5f" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="lastWeek" name="Last week" fill="#334155" radius={[3, 3, 0, 0]} />
          <Bar dataKey="thisWeek" name="This week" fill="#7c3aed" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
