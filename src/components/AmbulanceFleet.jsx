import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Users, Wrench, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import AmbulanceTripDetail from './AmbulanceTripDetail';

const STATUS_LABEL = {
  available: 'Available',
  dispatched: 'Dispatched',
  en_route: 'En route',
  on_scene: 'On scene',
  transporting: 'Transporting',
  arrived: 'Arrived',
};

const STATUS_COLOR = {
  available: 'text-green-500',
  dispatched: 'text-orange-500',
  en_route: 'text-orange-500',
  on_scene: 'text-blue-500',
  transporting: 'text-purple-500',
  arrived: 'text-slate-500',
};

const STATUS_DOT = {
  available: 'bg-green-500',
  dispatched: 'bg-orange-500',
  en_route: 'bg-orange-500',
  on_scene: 'bg-blue-500',
  transporting: 'bg-purple-500',
  arrived: 'bg-slate-500',
};

const EQUIPMENT_LABELS = {
  defib: 'Defib',
  ventilator: 'Vent',
  stretcher: 'Stretcher',
  meds: 'Meds',
};

function typeBadge(type) {
  if (type === 'als') {
    return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400">ALS</span>;
  }
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">BLS</span>;
}

function EquipmentIcons({ equipment }) {
  if (!equipment) return null;
  const items = Object.entries(equipment).filter(([, v]) => v);
  if (items.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5">
      {items.map(([key]) => (
        <span key={key} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          {EQUIPMENT_LABELS[key] || key}
        </span>
      ))}
    </div>
  );
}

function CrewRow({ crew }) {
  if (!crew || crew.length === 0) return null;
  const onShift = crew.filter((c) => c.onShift);
  return (
    <div className="mt-1.5 flex flex-col gap-0.5">
      {onShift.length === 0 && (
        <div className="text-[10px] text-red-400 flex items-center gap-1">
          <AlertTriangle size={10} /> No crew on shift
        </div>
      )}
      {crew.map((c, i) => (
        <div key={i} className="flex items-center gap-1.5 text-[11px]">
          <Users size={10} className="text-slate-400" />
          <span className={c.onShift ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600 line-through'}>
            {c.name}
          </span>
          <span className="text-slate-400 dark:text-slate-500">· {c.role}</span>
          {!c.onShift && <span className="text-[9px] text-slate-400">(off)</span>}
        </div>
      ))}
    </div>
  );
}

function ETACountdown({ etaMin, onArrived }) {
  const [displayEta, setDisplayEta] = useState(etaMin);
  const intervalRef = useRef(null);

  useEffect(() => {
    setDisplayEta(etaMin);
  }, [etaMin]);

  useEffect(() => {
    if (etaMin == null || etaMin <= 0) return;
    intervalRef.current = setInterval(() => {
      setDisplayEta((prev) => {
        const next = prev - 1 / 60;
        if (next <= 0) {
          clearInterval(intervalRef.current);
          onArrived?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [etaMin, onArrived]);

  const colorClass = displayEta < 5 ? 'text-green-500' : displayEta < 15 ? 'text-orange-500' : 'text-red-500';
  const pulseClass = displayEta <= 1 ? 'animate-pulse' : '';

  return (
    <span className={`font-mono text-[13px] font-bold ${colorClass} ${pulseClass}`}>
      {displayEta <= 0 ? 'Arrived' : `${displayEta.toFixed(1)}m`}
    </span>
  );
}

export default function AmbulanceFleet({
  ambulances,
  onCompleteTrip,
  onCancelTrip,
  onReassignTrip,
  otherAmbulances,
}) {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ambulances.filter((amb) => {
    if (filter !== 'all' && amb.status !== filter) return false;
    if (search && !amb.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const noCrewOnShift = ambulances.filter((a) => a.crew && a.crew.filter((c) => c.onShift).length === 0);

  return (
    <div className="flex flex-col gap-2">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          className="bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-slate-900 dark:text-slate-100 focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All units</option>
          <option value="available">Available</option>
          <option value="dispatched">Dispatched</option>
          <option value="en_route">En route</option>
          <option value="on_scene">On scene</option>
          <option value="transporting">Transporting</option>
        </select>
        <input
          className="flex-1 min-w-[100px] bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          placeholder="Search unit…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {noCrewOnShift.length > 0 && (
        <div className="text-[10px] text-orange-400 flex items-center gap-1 px-1">
          <AlertTriangle size={10} /> {noCrewOnShift.length} unit{noCrewOnShift.length > 1 ? 's' : ''} with no crew on shift
        </div>
      )}

      {/* Fleet list */}
      <div className="flex flex-col gap-1 max-h-[500px] overflow-auto scrollbar-thin">
        {filtered.length === 0 && (
          <div className="text-[12.5px] text-slate-400 dark:text-slate-500 text-center py-6">
            No units match filter.
          </div>
        )}
        {filtered.map((amb) => {
          const isExpanded = expanded === amb.id;
          const noCrew = amb.crew && amb.crew.filter((c) => c.onShift).length === 0;

          return (
            <div
              key={amb.id}
              className={`rounded-lg border ${
                noCrew
                  ? 'border-slate-200 dark:border-slate-700 opacity-50'
                  : amb.status === 'available'
                  ? 'border-slate-200 dark:border-slate-700'
                  : 'border-orange-200 dark:border-orange-900'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start gap-2 px-2.5 py-2">
                <button
                  onClick={() => setExpanded(isExpanded ? null : amb.id)}
                  className="mt-0.5 p-0.5 rounded text-slate-400 hover:text-slate-600"
                >
                  {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>

                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${STATUS_DOT[amb.trip?.status || amb.status] || 'bg-slate-500'}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-[12.5px] text-slate-900 dark:text-slate-100">{amb.name}</span>
                    {typeBadge(amb.type)}
                    {amb.utilization != null && (
                      <span className={`text-[10px] font-mono ${
                        amb.utilization > 0.8 ? 'text-red-500' : amb.utilization > 0.5 ? 'text-orange-500' : 'text-slate-400'
                      }`}>
                        {Math.round(amb.utilization * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {STATUS_LABEL[amb.trip?.status || amb.status] || (amb.trip?.status || amb.status)}
                  </div>

                  {amb.trip && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        → {amb.trip.call?.callerName || 'Unknown'}
                      </span>
                      <ETACountdown etaMin={amb.trip.etaMin} />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {amb.trip && amb.status !== 'arrived' && amb.status !== 'available' && (
                    <>
                      {onCompleteTrip && (
                        <button
                          onClick={() => onCompleteTrip(amb.id)}
                          disabled={amb.status !== 'en_route' && amb.status !== 'on_scene' && amb.status !== 'transporting'}
                          className="p-1.5 rounded text-[11px] bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Mark arrived"
                        >
                          <RefreshCw size={13} />
                        </button>
                      )}
                      {onCancelTrip && (
                        <button
                          onClick={() => onCancelTrip(amb.id)}
                          className="p-1.5 rounded text-[11px] bg-red-500/10 text-red-500 hover:bg-red-500/20"
                          title="Cancel dispatch"
                        >
                          <XCircle size={13} />
                        </button>
                      )}
                    </>
                  )}
                  {amb.status === 'available' && onReassignTrip && otherAmbulances && otherAmbulances.length > 0 && (
                    <button
                      onClick={() => onReassignTrip(amb.id)}
                      className="p-1.5 rounded text-[11px] bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                      title="Reassign to this unit"
                    >
                      <RefreshCw size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-2.5 pb-2.5">
                  {/* Equipment */}
                  <EquipmentIcons equipment={amb.equipment} />

                  {/* Crew */}
                  <CrewRow crew={amb.crew} />

                  {/* Trip detail */}
                  {amb.trip && <AmbulanceTripDetail trip={amb.trip} ambulance={amb} />}

                  {!amb.trip && amb.status === 'available' && (
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">No active trip</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
