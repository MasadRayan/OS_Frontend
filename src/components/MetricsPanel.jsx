import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { SEVERITY_LABELS, SEV_HEX } from '../lib/severity';
import { useTheme } from '../theme/ThemeContext';

function StatCard({ label, value, sub }) {
  return (
    <div className="flex-1 min-w-[120px] px-3.5 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1d2b39]">
      <div className="text-[11px] text-slate-400 dark:text-slate-500 mb-1">{label}</div>
      <div className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
      {sub && <div className="text-[10.5px] text-slate-400 dark:text-slate-500">{sub}</div>}
    </div>
  );
}

export default function MetricsPanel({ metrics }) {
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? '#2a3c4d' : '#e2e8f0';
  const tickColor = theme === 'dark' ? '#8ca0b4' : '#64748b';
  const tooltipBg = theme === 'dark' ? '#16212c' : '#ffffff';
  const tooltipText = theme === 'dark' ? '#e8eef4' : '#0f172a';

  const chartData = Object.entries(metrics.bySeverity).map(([sev, d]) => ({
    severity: SEVERITY_LABELS[sev],
    sevNum: sev,
    avgWait: d.avgWaitMinutes,
    count: d.count,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2.5 flex-wrap">
        <StatCard label="Avg wait (60m window)" value={`${metrics.avgWaitMinutes}m`} />
        <StatCard label="Throughput" value={metrics.throughputPerHour} sub="patients/hr" />
        <StatCard label="Ambulance utilization" value={`${metrics.ambulanceUtilization}%`} />
        <StatCard label="Fairness index" value={metrics.fairnessIndex} sub="1.0 = perfectly even" />
      </div>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="severity" tick={{ fill: tickColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} />
            <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} />
            <Tooltip
              contentStyle={{ background: tooltipBg, border: `1px solid ${gridColor}`, fontSize: 12 }}
              labelStyle={{ color: tooltipText }}
            />
            <Bar dataKey="avgWait" radius={[4, 4, 0, 0]}>
              {chartData.map((d) => (
                <Cell key={d.sevNum} fill={SEV_HEX[d.sevNum]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[10.5px] text-slate-400 dark:text-slate-500 -mt-2">
        Average wait time (minutes) by severity level — completed cases, last 60 minutes.
      </div>
    </div>
  );
}
