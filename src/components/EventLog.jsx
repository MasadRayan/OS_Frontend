export default function EventLog({ events }) {
  return (
    <div className="flex flex-col gap-1.5 max-h-[220px] overflow-auto scrollbar-thin">
      {events.length === 0 && <div className="text-[12.5px] text-slate-400 dark:text-slate-500">No activity yet.</div>}
      {events.map((e) => (
        <div key={e.id} className="text-xs flex gap-2">
          <span className="font-mono text-slate-400 dark:text-slate-500 flex-shrink-0">
            {new Date(e.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-slate-600 dark:text-slate-300">{e.message}</span>
        </div>
      ))}
    </div>
  );
}
