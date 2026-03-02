import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { formatCurrency } from '../../lib/utils';

// ─── Mock Xero data ───────────────────────────────────────────────────────────

interface MonthlyFinancial {
  month: string;
  actual: number;
  budget: number;
  variance: number;
}

const MOCK_FINANCIAL_DATA: MonthlyFinancial[] = [
  { month: 'Sep', actual: 142_300, budget: 135_000, variance:   7_300 },
  { month: 'Oct', actual: 168_400, budget: 160_000, variance:   8_400 },
  { month: 'Nov', actual: 121_000, budget: 130_000, variance:  -9_000 },
  { month: 'Dec', actual: 198_600, budget: 185_000, variance:  13_600 },
  { month: 'Jan', actual: 109_200, budget: 115_000, variance:  -5_800 },
  { month: 'Feb', actual: 134_800, budget: 128_000, variance:   6_800 },
];

const totalActual  = MOCK_FINANCIAL_DATA.reduce((s, d) => s + d.actual, 0);
const totalBudget  = MOCK_FINANCIAL_DATA.reduce((s, d) => s + d.budget, 0);
const totalVariance = totalActual - totalBudget;

// ─── Custom tooltip ───────────────────────────────────────────────────────────

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="rounded-lg border px-3 py-2.5 text-xs space-y-1"
      style={{ backgroundColor: '#1e293b', borderColor: '#334155', fontFamily: "'Inter', sans-serif" }}
    >
      <p style={{ color: '#94a3b8', fontWeight: 500 }}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span style={{ color: '#64748b' }}>{entry.name}:</span>
          <span style={{ color: '#e2e8f0', fontWeight: 500 }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FinancialComparisonChart() {
  const { xeroConnected, xeroOrganisationName } = useUserStore();

  if (!xeroConnected) return null;

  const isPositive = totalVariance >= 0;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-xs uppercase tracking-widest"
          style={{ color: '#475569', fontWeight: 500 }}
        >
          Financial Performance vs Budget
        </p>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
          style={{ backgroundColor: 'rgba(0,176,122,0.1)', color: '#34d399' }}
        >
          <BookOpen size={10} />
          <span style={{ fontWeight: 500 }}>Xero · {xeroOrganisationName}</span>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Total Revenue (6M)', value: formatCurrency(totalActual), accent: '#a78bfa' },
          { label: 'Total Budget (6M)',  value: formatCurrency(totalBudget), accent: '#64748b' },
          {
            label: 'Net Variance',
            value: `${isPositive ? '+' : ''}${formatCurrency(totalVariance)}`,
            accent: isPositive ? '#22c55e' : '#ef4444',
            icon: isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />,
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border p-4"
            style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
          >
            <p className="text-xs mb-2" style={{ color: '#475569' }}>
              {kpi.label}
            </p>
            <div className="flex items-center gap-1.5">
              {kpi.icon && <span style={{ color: kpi.accent }}>{kpi.icon}</span>}
              <p className="text-sm" style={{ color: kpi.accent, fontWeight: 600 }}>
                {kpi.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm" style={{ color: '#f1f5f9', fontWeight: 500 }}>
              Revenue vs Budget
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
              Last 6 months · GBP
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: '#64748b' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#7c3aed' }} />
              Actual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#334155' }} />
              Budget
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-6 border-t-2 border-dashed inline-block" style={{ borderColor: '#22c55e' }} />
              Variance
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={MOCK_FINANCIAL_DATA} barGap={4} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) =>
                v >= 1000 ? `£${(v / 1000).toFixed(0)}k` : `£${v}`
              }
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="actual" name="Actual Revenue" radius={[3, 3, 0, 0]}>
              {MOCK_FINANCIAL_DATA.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={entry.variance >= 0 ? '#7c3aed' : '#6d28d9'}
                />
              ))}
            </Bar>
            <Bar dataKey="budget" name="Budget" fill="#334155" radius={[3, 3, 0, 0]} />
            <Line
              type="monotone"
              dataKey="variance"
              name="Variance"
              stroke="#22c55e"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={{ fill: '#22c55e', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#22c55e' }}
            />
            <Legend
              wrapperStyle={{ display: 'none' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
