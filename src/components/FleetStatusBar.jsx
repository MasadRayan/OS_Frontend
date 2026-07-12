import { Truck, CheckCircle2, Navigation, Users, Clock, PhoneCall } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, tone = 'slate' }) {
  const toneClass = {
    brand: 'text-brand-light dark:text-brand-dark bg-teal-500/10',
    red: 'text-red-500 bg-red-500/10',
    green: 'text-green-500 bg-green-500/10',
    amber: 'text-orange-500 bg-orange-500/10',
    slate: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
  }[tone];

  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1d2b39]">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${toneClass}`}>
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="font-mono text-base font-bold text-slate-900 dark:text-slate-100 truncate">{value}</div>
        {sub && <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{sub}</div>}
      </div>
    </div>
  );
}

export default function FleetStatusBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2">
      <StatCard icon={Truck} label="Total units" value={stats.totalUnits} tone="slate" />
      <StatCard icon={CheckCircle2} label="Available" value={stats.available} sub="ready" tone="green" />
      <StatCard icon={Navigation} label="Dispatched" value={stats.dispatched} tone="amber" />
      <StatCard icon={Users} label="On scene" value={stats.onScene} tone="brand" />
      <StatCard icon={Clock} label="Avg response" value={`${stats.avgResponseTimeMin?.toFixed(1)}m`} tone="slate" />
      <StatCard icon={PhoneCall} label="Calls waiting" value={stats.callsWaiting} tone={stats.callsWaiting > 5 ? 'red' : 'slate'} />
      <StatCard icon={Clock} label="Avg wait" value={`${stats.avgWaitTimeMin?.toFixed(1)}m`} tone="slate" />
    </div>
  );
}
