import { PhoneCall, MapPin, X } from 'lucide-react';
import { SEV_DOT_BG, SEV_BADGE, SEVERITY_LABELS } from '../lib/severity';

export default function CallQueueList({ callsQueue, onFlyToCall, onCancelCall, onSelectCall, selectedCallId }) {
  if (!callsQueue || callsQueue.length === 0) {
    return (
      <div className="text-[12.5px] text-slate-400 dark:text-slate-500 text-center py-8">
        No pending calls
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {callsQueue.map((call) => {
        const isSelected = selectedCallId === call.id;
        return (
          <div
            key={call.id}
            className={`flex items-start gap-2.5 px-2.5 py-2 rounded-lg border cursor-pointer transition-colors ${
              isSelected
                ? 'border-brand-light dark:border-brand-dark bg-teal-500/10'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
            onClick={() => onSelectCall?.(call.id)}
          >
            <span className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${SEV_DOT_BG[call.basePriority] || SEV_DOT_BG[5]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-medium text-[12.5px] text-slate-900 dark:text-slate-100 truncate">
                  {call.callerName}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${SEV_BADGE[call.basePriority] || SEV_BADGE[5]}`}>
                  {SEVERITY_LABELS[call.basePriority] || 'Unknown'}
                </span>
              </div>
              {call.note && (
                <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{call.note}</div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                  waiting {call.waitMinutes?.toFixed(1)}m
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFlyToCall?.(call.lat, call.lng);
                }}
                title="Fly to location"
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <MapPin size={13} />
              </button>
              {onCancelCall && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelCall(call.id);
                  }}
                  title="Cancel call"
                  className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
