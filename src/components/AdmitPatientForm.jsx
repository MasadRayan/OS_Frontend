import { useState } from 'react';
import { SEV_DOT_BG } from '../lib/severity';

const SEVERITIES = [
  { value: 1, label: 'Critical', hint: 'Immediate, life-threatening' },
  { value: 2, label: 'Serious', hint: 'Urgent, high risk' },
  { value: 3, label: 'Moderate', hint: 'Needs attention soon' },
  { value: 4, label: 'Minor', hint: 'Stable, can wait' },
  { value: 5, label: 'Non-urgent', hint: 'Routine' },
];

const inputClass =
  'w-full bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-[13.5px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-light/40 dark:focus:ring-brand-dark/40';

const labelClass = 'text-[11.5px] text-slate-500 dark:text-slate-400 mb-1 block';

export default function AdmitPatientForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [condition, setCondition] = useState('');
  const [severity, setSeverity] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), age: Number(age) || null, condition: condition.trim(), severity });
      setName('');
      setAge('');
      setCondition('');
      setSeverity(3);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <div className="flex gap-2">
        <div className="flex-[2]">
          <label className={labelClass}>Patient name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="flex-1">
          <label className={labelClass}>Age</label>
          <input
            className={inputClass}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="34"
            inputMode="numeric"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Condition / complaint</label>
        <input
          className={inputClass}
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="Chest pain, shortness of breath"
        />
      </div>

      <div>
        <label className={labelClass}>Triage severity</label>
        <div className="flex flex-col gap-1.5">
          {SEVERITIES.map((s) => (
            <label
              key={s.value}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer ${
                severity === s.value
                  ? 'border-brand-light dark:border-brand-dark bg-teal-500/10'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="severity"
                checked={severity === s.value}
                onChange={() => setSeverity(s.value)}
                className="accent-teal-600"
              />
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${SEV_DOT_BG[s.value]}`} />
              <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{s.label}</span>
              <span className="text-[11.5px] text-slate-400 dark:text-slate-500 ml-auto">{s.hint}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 bg-brand-light dark:bg-brand-dark text-white dark:text-[#04201d] border-none rounded-lg px-3 py-2.5 font-bold text-[13.5px] cursor-pointer disabled:opacity-60"
      >
        {submitting ? 'Adding…' : 'Add to waiting list'}
      </button>
    </form>
  );
}
