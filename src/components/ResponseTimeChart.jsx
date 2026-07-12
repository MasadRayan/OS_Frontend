import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Line, ComposedChart, Cell,
} from 'recharts';
import { useTheme } from '../theme/ThemeContext';
import { SEV_HEX, SEVERITY_LABELS } from '../lib/severity';

export default function ResponseTimeChart({ responseTimes }) {
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? '#2a3c4d' : '#e2e8f0';
  const tickColor = theme === 'dark' ? '#8ca0b4' : '#64748b';
  const tooltipStyle = {
    background: theme === 'dark' ? '#16212c' : '#ffffff',
    border: `1px solid ${gridColor}`,
    fontSize: 12,
  };
  const labelStyle = { color: theme === 'dark' ? '#e8eef4' : '#0f172a' };

  if (!responseTimes) {
    return (
      <div className="text-[12.5px] text-slate-400 dark:text-slate-500 text-center py-12">
        No response time data yet.
      </div>
    );
  }

  const bySeverity = (responseTimes.bySeverity || []).map((d) => ({
    ...d,
    severity: SEVERITY_LABELS[d.severity] || `Sev ${d.severity}`,
    fill: SEV_HEX[d.severity] || '#64748b',
  }));

  const byHour = (responseTimes.byHour || []).map((d) => ({
    ...d,
    label: `${d.hour}:00`,
  }));

  const overall = responseTimes.overall;

  return (
    <div className="flex flex-col gap-5">
      {/* Overall stats */}
      {overall && (
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Avg</span>
            <span className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100">{overall.avgMinutes?.toFixed(1)}m</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Median</span>
            <span className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100">{overall.p50?.toFixed(1)}m</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">P95</span>
            <span className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100">{overall.p95?.toFixed(1)}m</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Trips</span>
            <span className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100">{overall.totalTrips}</span>
          </div>
        </div>
      )}

      {/* By severity */}
      {bySeverity.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Response time by severity
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={bySeverity} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="severity" tick={{ fill: tickColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} />
                <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="avgMinutes" name="Avg minutes" radius={[4, 4, 0, 0]}>
                  {bySeverity.map((d) => (
                    <Cell key={d.severity} fill={d.fill} />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="p50" name="Median" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p95" name="P95" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* By hour */}
      {byHour.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Response time by hour of day
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byHour} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: tickColor, fontSize: 10 }} axisLine={{ stroke: gridColor }} />
                <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                <Bar dataKey="avgMinutes" name="Avg response (min)" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
