import { Clock, MapPin, PhoneCall, Navigation } from 'lucide-react';
import { SEV_DOT_BG, SEV_BADGE, SEVERITY_LABELS } from '../lib/severity';

const TRIP_STATUS_STEPS = ['dispatched', 'en_route', 'on_scene', 'transporting', 'arrived'];

const STATUS_LABEL = {
  dispatched: 'Dispatched',
  en_route: 'En route',
  on_scene: 'On scene',
  transporting: 'Transporting',
  arrived: 'Arrived',
};

function fmtTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function TripTimeline({ trip }) {
  const currentIdx = TRIP_STATUS_STEPS.indexOf(trip.status);

  return (
    <div className="flex items-center gap-0.5 my-2">
      {TRIP_STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div
              className={`w-full h-1 rounded-full ${
                done ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'
              } ${isCurrent ? 'ring-2 ring-teal-500/40' : ''}`}
            />
            <span className={`text-[9px] mt-1 ${done ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-600'}`}>
              {STATUS_LABEL[step]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AmbulanceTripDetail({ trip, ambulance }) {
  if (!trip) return null;

  const call = trip.call || {};
  const hospital = trip.hospital || {};

  return (
    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
        Trip {trip.id}
      </div>

      <TripTimeline trip={trip} />

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11.5px] mt-2">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <PhoneCall size={11} />
          <span>{call.callerName || 'Unknown'}</span>
        </div>
        {call.basePriority && (
          <div className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${SEV_BADGE[call.basePriority] || SEV_BADGE[5]}`}>
              {SEVERITY_LABELS[call.basePriority] || 'Unknown'}
            </span>
          </div>
        )}
        {call.note && (
          <div className="col-span-2 text-slate-400 dark:text-slate-500 truncate" title={call.note}>
            {call.note}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Clock size={11} />
          <span>Dispatched {fmtTime(trip.dispatchedAt)}</span>
        </div>
        {trip.enRouteAt && (
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Navigation size={11} />
            <span>En route {fmtTime(trip.enRouteAt)}</span>
          </div>
        )}
        {trip.onSceneAt && (
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <MapPin size={11} />
            <span>On scene {fmtTime(trip.onSceneAt)}</span>
          </div>
        )}
        {hospital.name && (
          <div className="col-span-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate">
            <Navigation size={11} />
            <span>Destination: {hospital.name}</span>
          </div>
        )}
      </div>

      {trip.etaMin != null && (
        <div className={`mt-2 text-[12px] font-mono font-bold ${
          trip.etaMin < 5 ? 'text-green-500' : trip.etaMin < 15 ? 'text-orange-500' : 'text-red-500'
        }`}>
          ETA {trip.etaMin.toFixed(1)}m
        </div>
      )}
    </div>
  );
}
