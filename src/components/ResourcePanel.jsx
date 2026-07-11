import { SEVERITY_LABELS, SEV_DOT_BG } from '../lib/severity';

function Bar({ label, used, total }) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  const color = pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-yellow-500' : 'bg-brand-light dark:bg-brand-dark';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-mono text-slate-900 dark:text-slate-100">
          {used}/{total}
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-[#0f1720] rounded overflow-hidden">
        <div className={`h-full rounded transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const DEPT_BADGE = {
  ER: 'bg-red-500/10 text-red-600 dark:text-red-400',
  ICU: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  WARD: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

const DEPT_STAGE_TOTAL_MIN = {
  ER: { 1: 3, 2: 2.5, 3: 2, 4: 1.5, 5: 1 },
  ICU: { 1: 4, 2: 3 },
  WARD: { 1: 3, 2: 2, 3: 2, 4: 1, 5: 1 },
};

function StageProgress({ patient }) {
  const total = DEPT_STAGE_TOTAL_MIN[patient.department]?.[patient.basePriority] || 1;
  const remaining = patient.stageRemainingMin ?? 0;
  const pct = Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  return (
    <div className="flex items-center gap-1.5 flex-1">
      <div className="h-1 flex-1 bg-slate-100 dark:bg-[#0f1720] rounded overflow-hidden">
        <div
          className="h-full bg-brand-light dark:bg-brand-dark rounded transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 w-9 text-right">
        {remaining.toFixed(1)}m
      </span>
    </div>
  );
}

export default function ResourcePanel({ resources, admitted, onDischarge }) {
  const { capacity, available } = resources;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Bar label="Beds" used={capacity.beds - available.beds} total={capacity.beds} />
        <Bar label="Doctors" used={capacity.doctors - available.doctors} total={capacity.doctors} />
        <Bar label="ICU slots" used={capacity.icu - available.icu} total={capacity.icu} />
        <Bar label="Ventilators" used={capacity.ventilators - available.ventilators} total={capacity.ventilators} />
      </div>

      <div className="font-mono text-[11px] text-slate-400 dark:text-slate-500 border-t border-dashed border-slate-200 dark:border-slate-700 pt-2.5">
        Admissions and department transfers are only granted when the
        Banker&apos;s Algorithm confirms the system stays in a safe state —
        protecting resources reserved for already-admitted critical patients.
      </div>

      <div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Currently admitted ({admitted.length}) · auto-progresses ER → ICU → Ward → Discharge
        </div>
        <div className="flex flex-col gap-1.5">
          {admitted.length === 0 && (
            <div className="text-[12.5px] text-slate-400 dark:text-slate-500">No patients currently admitted.</div>
          )}
          {admitted.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-1.5 px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${SEV_DOT_BG[p.basePriority]}`} />
                <div className="flex-1 text-[12.5px] text-slate-900 dark:text-slate-100 truncate">
                  {p.name} <span className="text-slate-400 dark:text-slate-500">· {SEVERITY_LABELS[p.basePriority]}</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${DEPT_BADGE[p.department]}`}>
                  {p.department}
                </span>
                {p.transferBlocked && (
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    title="Next department is full — Banker's Algorithm is holding this patient in place"
                  >
                    HOLDING
                  </span>
                )}
                <button
                  onClick={() => onDischarge(p.id)}
                  className="bg-transparent border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-md px-2 py-1 text-[11px] cursor-pointer hover:border-slate-400 dark:hover:border-slate-500"
                >
                  Discharge
                </button>
              </div>
              <StageProgress patient={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
