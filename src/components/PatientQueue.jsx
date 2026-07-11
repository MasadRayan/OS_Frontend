import { SEVERITY_LABELS, SEV_DOT_BG } from '../lib/severity';

export default function PatientQueue({ patients, onTreatNext, algorithmName }) {
  if (!patients.length) {
    return <div className="text-slate-400 dark:text-slate-500 text-[13px]">Waiting list is empty.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {algorithmName && (
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Sorted by
          </span>
          <span className="font-mono text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 rounded px-1.5 py-0.5">
            {algorithmName}
          </span>
        </div>
      )}
      {patients.map((p, i) => (
        <div
          key={p.id}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border bg-slate-50 dark:bg-[#1d2b39] ${
            p.deadlineMissed
              ? 'border-red-500 animate-pulse-critical'
              : p.basePriority <= 2
              ? 'border-slate-200 dark:border-slate-700 animate-pulse-critical'
              : 'border-slate-200 dark:border-slate-700'
          }`}
        >
          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 w-4 text-center">{i + 1}</span>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${SEV_DOT_BG[p.basePriority]}`} />
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold text-slate-900 dark:text-slate-100 flex gap-1.5 items-center flex-wrap">
              {p.name}
              {p.aged && (
                <span
                  className="font-mono text-[9.5px] text-brand-light dark:text-brand-dark border border-brand-light dark:border-brand-dark rounded px-1"
                  title="Priority boosted by aging to prevent starvation"
                >
                  AGED
                </span>
              )}
              {p.escalated && (
                <span
                  className="font-mono text-[9.5px] text-orange-500 border border-orange-500 rounded px-1"
                  title={`Condition worsened from ${SEVERITY_LABELS[p.originalSeverity]}`}
                >
                  ESCALATED
                </span>
              )}
              {p.deadlineMissed && (
                <span
                  className="font-mono text-[9.5px] text-white bg-red-500 rounded px-1"
                  title="Golden-window deadline has passed — EDF is forcing this patient to the top"
                >
                  DEADLINE MISSED
                </span>
              )}
              {!p.deadlineMissed && p.deadlineUrgent && (
                <span
                  className="font-mono text-[9.5px] text-red-500 border border-red-500 rounded px-1"
                  title="Deadline imminent — EDF is boosting priority"
                >
                  DEADLINE SOON
                </span>
              )}
            </div>
            <div className="text-[11.5px] text-slate-400 dark:text-slate-500">
              {SEVERITY_LABELS[p.basePriority]} · {p.condition || 'No condition noted'}
              {p.deadlineAt && !p.deadlineMissed && (
                <span> · deadline in {p.deadlineSlackMin.toFixed(1)}m</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400">{p.waitMinutes}m</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">waiting</div>
          </div>
        </div>
      ))}
      <button
        onClick={onTreatNext}
        className="mt-1 bg-transparent border border-brand-light dark:border-brand-dark text-brand-light dark:text-brand-dark rounded-lg px-3 py-2 font-bold text-[13px] cursor-pointer hover:bg-teal-500/10"
      >
        Treat next patient (highest priority)
      </button>
    </div>
  );
}
