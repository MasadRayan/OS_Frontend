import { useState } from 'react';
import { Settings2, Check, ChevronDown, Loader2, Info } from 'lucide-react';
import { getAlgorithmInfo } from '../lib/algorithmInfo';

export default function SchedulerSelector({ config, onSetAlgorithm, loading }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(config?.activeAlgorithm || 'preemptivePriority');
  const [params, setParams] = useState({ ...(config?.params || {}) });
  const [applying, setApplying] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const activeInfo = getAlgorithmInfo(config?.activeAlgorithm);
  const allAlgorithms = config?.availableAlgorithms || [];
  const selectedInfo = getAlgorithmInfo(selected);
  const hasParams = selectedInfo.params && Object.keys(selectedInfo.params).length > 0;

  const handleSelect = (algo) => {
    setSelected(algo);
    const newInfo = getAlgorithmInfo(algo);
    const defaults = {};
    if (newInfo.params) {
      for (const key of Object.keys(newInfo.params)) {
        const existing = config?.params?.[key];
        defaults[key] = existing !== undefined ? existing : newInfo.params[key].default;
      }
    }
    setParams(defaults);
    setFeedback(null);
  };

  const handleParamChange = (key, value) => {
    setParams((prev) => {
      const info = getAlgorithmInfo(selected);
      const paramDef = info.params?.[key];
      if (paramDef?.type === 'json') {
        try { return { ...prev, [key]: JSON.parse(value) }; }
        catch { return prev; }
      }
      return { ...prev, [key]: paramDef?.type === 'number' ? Number(value) : value };
    });
  };

  const handleApply = async () => {
    setApplying(true);
    setFeedback(null);
    try {
      const payload = hasParams ? params : undefined;
      await onSetAlgorithm(selected, payload);
      setFeedback({ ok: true, message: `Switched to ${selectedInfo.name}` });
      setTimeout(() => setOpen(false), 800);
    } catch (err) {
      setFeedback({ ok: false, message: err.message });
    } finally {
      setApplying(false);
    }
  };

  if (!config) return null;

  const paramValue = (key) => {
    const v = params[key];
    const def = selectedInfo.params?.[key];
    if (def?.type === 'json' && v && typeof v === 'object') {
      return JSON.stringify(v);
    }
    return v ?? '';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1d2b39] text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#243447] transition-colors"
      >
        <Settings2 size={14} className="text-slate-400" />
        <span className="font-semibold">{activeInfo.shortName}</span>
        <span className="text-slate-400 dark:text-slate-500 text-xs">Scheduler</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 w-80 bg-white dark:bg-[#16212c] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Scheduler Algorithm</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Choose how the waiting queue is sorted</p>
            </div>

            <div className="p-4 max-h-48 overflow-y-auto space-y-1">
              {allAlgorithms.map((algo) => {
                const info = getAlgorithmInfo(algo.id);
                const isActive = selected === algo.id;
                return (
                  <button
                    key={algo.id}
                    onClick={() => handleSelect(algo.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1d2b39] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{info.shortName}</span>
                      {isActive && <Check size={14} className="text-teal-500" />}
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">{info.name}</span>
                  </button>
                );
              })}
            </div>

            {hasParams && (
              <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-3">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Parameters
                </h4>
                <div className="space-y-2">
                  {Object.entries(selectedInfo.params).map(([key, def]) => (
                    <div key={key}>
                      <label className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">{def.label}</label>
                      {def.type === 'json' ? (
                        <textarea
                          value={paramValue(key)}
                          onChange={(e) => handleParamChange(key, e.target.value)}
                          rows={2}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200"
                        />
                      ) : (
                        <input
                          type={def.type || 'number'}
                          value={paramValue(key)}
                          onChange={(e) => handleParamChange(key, e.target.value)}
                          min={def.min}
                          max={def.max}
                          step={def.step}
                          className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-4 pb-4">
              <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0f1720] text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                <Info size={12} className="mt-0.5 flex-shrink-0" />
                <span>{selectedInfo.osConcept}</span>
              </div>
            </div>

            {feedback && (
              <div className={`px-4 pb-3 ${feedback.ok ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'} text-xs`}>
                {feedback.message}
              </div>
            )}

            <div className="px-4 pb-4">
              <button
                onClick={handleApply}
                disabled={applying || loading}
                className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-3 py-2 text-sm font-bold disabled:opacity-50 transition-colors"
              >
                {(applying || loading) && <Loader2 size={14} className="animate-spin" />}
                {applying ? 'Applying…' : 'Apply'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
