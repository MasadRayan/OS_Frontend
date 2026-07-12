import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { ShieldCheck, ShieldAlert, Clock, MapPin, TimerReset, TrendingUp, AlarmClockCheck, DoorClosed, Activity } from 'lucide-react';
import { useAnalysisData } from '../hooks/useAnalysisData';
import { useTheme } from '../theme/ThemeContext';
import TopBar from '../components/TopBar';
import Panel from '../components/Panel';
import ResponseTimeChart from '../components/ResponseTimeChart';
import { SEVERITY_LABELS, SEV_HEX, SEV_BADGE } from '../lib/severity';

function StatCard({ icon: Icon, label, value, sub, tone = 'brand' }) {
  const toneClass = {
    brand: 'text-brand-light dark:text-brand-dark bg-teal-500/10',
    red: 'text-red-500 bg-red-500/10',
    green: 'text-green-500 bg-green-500/10',
  }[tone];

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16212c]">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${toneClass}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-slate-400 dark:text-slate-500">{label}</div>
        <div className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{value}</div>
        {sub && <div className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate">{sub}</div>}
      </div>
    </div>
  );
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function AnalysisPage() {
  const { analysis, responseTimes, connected } = useAnalysisData();
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? '#2a3c4d' : '#e2e8f0';
  const tickColor = theme === 'dark' ? '#8ca0b4' : '#64748b';
  const tooltipStyle = {
    background: theme === 'dark' ? '#16212c' : '#ffffff',
    border: `1px solid ${gridColor}`,
    fontSize: 12,
  };
  const labelStyle = { color: theme === 'dark' ? '#e8eef4' : '#0f172a' };

  if (!analysis) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
        <span>Loading analysis…</span>
        {!connected && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Make sure the backend server is running on :4000
          </span>
        )}
      </div>
    );
  }

  const history = analysis.history.map((h) => ({ ...h, label: fmtTime(h.at) }));

  const severityData = Object.entries(analysis.severityTotals).map(([sev, count]) => ({
    severity: SEVERITY_LABELS[sev],
    sevNum: sev,
    count,
  }));

  const admissionPie = [
    { name: 'Granted', value: analysis.admissionsGranted, color: '#22c55e' },
    { name: 'Blocked', value: analysis.admissionsBlocked, color: '#ef4444' },
  ];

  const deadlinePie = [
    { name: 'Met deadline', value: analysis.deadlineMet, color: '#22c55e' },
    { name: 'Missed deadline', value: analysis.deadlineMissed, color: '#ef4444' },
  ];
  const deadlineTotal = analysis.deadlineMet + analysis.deadlineMissed;

  return (
    <div className="min-h-full flex flex-col">
      <TopBar connected={connected} title="Analysis" hospitalName="Performance & scheduling evaluation" />

      <main className="flex-1 flex flex-col gap-5 p-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={ShieldCheck}
            label="Admissions granted"
            value={analysis.admissionsGranted}
            sub="Banker's Algorithm safe"
            tone="green"
          />
          <StatCard
            icon={ShieldAlert}
            label="Admissions blocked"
            value={analysis.admissionsBlocked}
            sub="Unsafe-state refusals"
            tone="red"
          />
          <StatCard
            icon={MapPin}
            label="Avg dispatch ETA"
            value={`${analysis.avgDispatchEtaMin}m`}
            sub={`${analysis.totalDispatches} dispatches total`}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={TrendingUp}
            label="Condition escalations"
            value={analysis.escalationEvents}
            sub="Auto-worsened while waiting"
            tone="red"
          />
          <StatCard
            icon={AlarmClockCheck}
            label="EDF deadline compliance"
            value={deadlineTotal ? `${Math.round((analysis.deadlineMet / deadlineTotal) * 100)}%` : '—'}
            sub={`${analysis.deadlineMet} met / ${analysis.deadlineMissed} missed`}
            tone={analysis.deadlineMissed > analysis.deadlineMet ? 'red' : 'green'}
          />
          <StatCard
            icon={DoorClosed}
            label="Transfer backpressure"
            value={analysis.transferBlocks}
            sub="ICU/Ward transfers held by Banker's Algorithm"
          />
          <StatCard
            icon={TimerReset}
            label="Starvation preventions"
            value={analysis.agingEvents}
            sub="Times aging changed the outcome"
          />
        </div>

        {/* Trend: wait time & fairness */}
        <Panel title="Wait time & fairness trend" eyebrow="Sampled every 5s, most recent snapshots">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: tickColor, fontSize: 10 }} axisLine={{ stroke: gridColor }} minTickGap={40} />
                <YAxis yAxisId="wait" tick={{ fill: tickColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} />
                <YAxis yAxisId="fair" orientation="right" domain={[0, 1]} tick={{ fill: tickColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="wait" type="monotone" dataKey="avgWaitMinutes" name="Avg wait (min)" stroke="#0d9488" strokeWidth={2} dot={false} />
                <Line yAxisId="fair" type="monotone" dataKey="fairnessIndex" name="Fairness index" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Trend: system load */}
        <Panel title="System load trend" eyebrow="Waiting list, admitted patients, pending calls & ambulance utilization">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: tickColor, fontSize: 10 }} axisLine={{ stroke: gridColor }} minTickGap={40} />
                <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="waitingCount" name="Waiting" stroke="#eab308" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="admittedCount" name="Admitted" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pendingCalls" name="Pending calls" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ambulanceUtilization" name="Ambulance util. %" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Banker's Algorithm effectiveness */}
          <Panel title="Banker's Algorithm outcomes" eyebrow="Admission attempts: granted vs. blocked">
            <div className="h-[220px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={admissionPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {admissionPie.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {Object.keys(analysis.blockedReasons).length > 0 && (
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Block reasons:{' '}
                {Object.entries(analysis.blockedReasons)
                  .map(([reason, count]) => `${reason} (${count})`)
                  .join(', ')}
              </div>
            )}
          </Panel>

          {/* EDF deadline compliance */}
          <Panel title="EDF golden-window compliance" eyebrow="Critical/Serious patients treated before vs. after deadline">
            <div className="h-[220px] flex items-center justify-center">
              {deadlineTotal === 0 ? (
                <div className="text-[12.5px] text-slate-400 dark:text-slate-500">
                  No Critical/Serious patients treated yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deadlinePie}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {deadlinePie.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Severity distribution */}
          <Panel title="Severity distribution" eyebrow="All patients & calls ever received">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="severity" tick={{ fill: tickColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} />
                  <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {severityData.map((d) => (
                      <Cell key={d.sevNum} fill={SEV_HEX[d.sevNum]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Dispatch log table */}
          <Panel title="Recent ambulance dispatches" eyebrow="Priority-first, nearest-available evidence">
            <div className="overflow-auto scrollbar-thin max-h-72">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="text-left text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-1.5 pr-2 font-medium">Caller</th>
                    <th className="py-1.5 pr-2 font-medium">Severity</th>
                    <th className="py-1.5 pr-2 font-medium">Ambulance</th>
                    <th className="py-1.5 pr-2 font-medium">Dist.</th>
                    <th className="py-1.5 font-medium">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.dispatchLog.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400 dark:text-slate-500">
                        No dispatches yet.
                      </td>
                    </tr>
                  )}
                  {analysis.dispatchLog.map((d) => (
                    <tr key={d.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-1.5 pr-2 text-slate-800 dark:text-slate-200">{d.callerName}</td>
                      <td className="py-1.5 pr-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${SEV_BADGE[d.severity]}`}>
                          {SEVERITY_LABELS[d.severity]}
                        </span>
                      </td>
                      <td className="py-1.5 pr-2 text-slate-500 dark:text-slate-400">{d.ambulanceName}</td>
                      <td className="py-1.5 pr-2 font-mono text-slate-500 dark:text-slate-400">{d.distanceKm}km</td>
                      <td className="py-1.5 font-mono text-slate-500 dark:text-slate-400">{d.etaMin}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Admission log table */}
          <Panel title="Recent admission attempts" eyebrow="Safe-state checks against hospital capacity">
            <div className="overflow-auto scrollbar-thin max-h-72">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="text-left text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-1.5 pr-2 font-medium">Patient</th>
                    <th className="py-1.5 pr-2 font-medium">Severity</th>
                    <th className="py-1.5 pr-2 font-medium">Outcome</th>
                    <th className="py-1.5 font-medium">Waited</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.admissionLog.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 dark:text-slate-500">
                        No admission attempts yet.
                      </td>
                    </tr>
                  )}
                  {analysis.admissionLog.map((a) => (
                    <tr key={a.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-1.5 pr-2 text-slate-800 dark:text-slate-200">{a.name}</td>
                      <td className="py-1.5 pr-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${SEV_BADGE[a.severity]}`}>
                          {SEVERITY_LABELS[a.severity]}
                        </span>
                      </td>
                      <td className="py-1.5 pr-2">
                        {a.granted ? (
                          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                            <ShieldCheck size={12} /> Granted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 font-semibold" title={a.reason}>
                            <ShieldAlert size={12} /> Blocked
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 font-mono text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={11} /> {a.waitedMinutes}m
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Response time analytics */}
        <div className="grid grid-cols-1 gap-5">
          <Panel title="Response time analytics" eyebrow="Ambulance dispatch performance">
            <ResponseTimeChart responseTimes={responseTimes} />
          </Panel>
        </div>
      </main>
    </div>
  );
}
