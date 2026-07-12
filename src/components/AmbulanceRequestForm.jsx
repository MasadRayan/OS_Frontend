import { useState } from 'react';
import { SEVERITY_LABELS, SEVERITY_LIST, SEV_DOT_BG } from '../lib/severity';

const inputClass =
  'w-full bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-[13.5px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-light/40 dark:focus:ring-brand-dark/40';

export default function AmbulanceRequestForm({ pendingLocation, onClearLocation, onSubmit, hospitals }) {
  const [callerName, setCallerName] = useState('');
  const [note, setNote] = useState('');
  const [severity, setSeverity] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [destinationId, setDestinationId] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!pendingLocation || !callerName.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        callerName: callerName.trim(),
        note: note.trim(),
        severity,
        lat: pendingLocation.lat,
        lng: pendingLocation.lng,
        ...(destinationId ? { destinationId } : {}),
      });
      setCallerName('');
      setNote('');
      setSeverity(2);
      setDestinationId('');
    } finally {
      setSubmitting(false);
    }
  }

  const showHospitals = hospitals && hospitals.length > 1;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <div
        className={`text-xs px-2.5 py-2 rounded-lg border border-dashed ${
          pendingLocation
            ? 'border-brand-light dark:border-brand-dark text-brand-light dark:text-brand-dark'
            : 'border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
        }`}
      >
        {pendingLocation
          ? `Location pinned: ${pendingLocation.lat.toFixed(4)}, ${pendingLocation.lng.toFixed(4)}`
          : 'Click anywhere on the map to pin the emergency location'}
      </div>

      <input className={inputClass} placeholder="Caller name" value={callerName} onChange={(e) => setCallerName(e.target.value)} />
      <input
        className={inputClass}
        placeholder="Note (e.g. road accident, 2 injured)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="flex gap-1.5 flex-wrap">
        {SEVERITY_LIST.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setSeverity(s)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11.5px] border ${
              severity === s
                ? 'border-brand-light dark:border-brand-dark bg-teal-500/10 text-slate-900 dark:text-slate-100'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${SEV_DOT_BG[s]}`} />
            {SEVERITY_LABELS[s]}
          </button>
        ))}
      </div>

      {showHospitals && (
        <select
          className={inputClass}
          value={destinationId}
          onChange={(e) => setDestinationId(e.target.value)}
        >
          <option value="">Auto-select destination hospital</option>
          {hospitals.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name} {h.bedsAvailable != null ? `(${h.bedsAvailable} beds)` : ''}
            </option>
          ))}
        </select>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!pendingLocation || !callerName.trim() || submitting}
          className={`flex-1 text-white rounded-lg px-3 py-2.5 font-bold text-[13px] ${
            pendingLocation && callerName.trim() && !submitting ? 'bg-red-500 cursor-pointer' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
          }`}
        >
          {submitting ? 'Dispatching…' : 'Dispatch ambulance'}
        </button>
        {pendingLocation && (
          <button
            type="button"
            onClick={onClearLocation}
            className="bg-transparent border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-lg px-3 py-2.5 text-[13px] cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
