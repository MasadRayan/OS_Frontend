const STATUS_LABEL = { available: 'Available', dispatched: 'En route' };

export default function AmbulanceFleet({ ambulances, onCompleteTrip }) {
  return (
    <div className="flex flex-col gap-1.5">
      {ambulances.map((amb) => (
        <div
          key={amb.id}
          className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              amb.status === 'available' ? 'bg-brand-light dark:bg-brand-dark' : 'bg-orange-500'
            }`}
          />
          <div className="flex-1 text-[12.5px] text-slate-900 dark:text-slate-100">
            {amb.name}
            <span className="text-slate-400 dark:text-slate-500"> · {STATUS_LABEL[amb.status] || amb.status}</span>
            {amb.trip && (
              <div className="text-[11px] text-slate-400 dark:text-slate-500">
                → {amb.trip.call.callerName} · ETA {amb.trip.etaMin.toFixed(1)}m
              </div>
            )}
          </div>
          {amb.status === 'dispatched' && (
            <button
              onClick={() => onCompleteTrip(amb.id)}
              className="bg-transparent border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-md px-2 py-1 text-[11px] cursor-pointer hover:border-slate-400 dark:hover:border-slate-500"
            >
              Mark arrived
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
