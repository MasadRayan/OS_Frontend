import { useEffect, useState } from 'react';

export default function TopBar({ connected, hospitalName, title = 'Dashboard' }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16212c]">
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-[10.5px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-[13px]">
          {hospitalName || 'Emergency Triage & Dispatch'}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <span className="font-mono text-slate-500 dark:text-slate-400 text-[13px]">{now.toLocaleTimeString()}</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-slate-500 dark:text-slate-400">{connected ? 'Live' : 'Reconnecting…'}</span>
        </div>
      </div>
    </header>
  );
}
