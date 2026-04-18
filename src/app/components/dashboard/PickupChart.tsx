import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { PickupPoint } from '../../lib/mockData';

interface PickupChartProps {
  data: PickupPoint[];
  loading?: boolean;
}

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
          <span className="font-semibold" style={{ color: 'var(--vzir-text)' }}>{entry.value} rooms</span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = () => (
  <div className="flex items-center justify-end gap-4 mb-4">
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#7C3AED' }} />
      <span className="text-xs" style={{ color: 'var(--vzir-text-2)' }}>This week</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#CBD5E1' }} />
      <span className="text-xs" style={{ color: 'var(--vzir-text-2)' }}>Last week</span>
    </div>
  </div>
);

export function PickupChart({ data, loading = false }: PickupChartProps) {
  if (loading) {
    return (
      <div className="rounded-2xl p-5 border animate-pulse" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
        <div className="h-4 w-48 rounded mb-6" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
        <div className="h-48 w-full rounded" style={{ backgroundColor: 'var(--vzir-surface-3)' }} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--vzir-surface)', borderColor: 'var(--vzir-border)' }}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--vzir-text)' }}>
          Pickup Pace Comparison
        </h2>
        <span className="text-xs" style={{ color: 'var(--vzir-text-3)' }}>Room nights booked / day</span>
      </div>
      <CustomLegend />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={3}>
          <CartesianGrid stroke="var(--vzir-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.04)' }} />
          <Bar dataKey="lastWeek" name="Last week" fill="#E2E8F0" radius={[3, 3, 0, 0]} />
          <Bar dataKey="thisWeek" name="This week" fill="#7C3AED" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
