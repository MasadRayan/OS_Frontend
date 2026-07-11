import { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import TopBar from '../components/TopBar';
import Panel from '../components/Panel';
import AmbulanceMap from '../components/AmbulanceMap';
import AmbulanceRequestForm from '../components/AmbulanceRequestForm';
import AmbulanceFleet from '../components/AmbulanceFleet';

export default function AmbulancePage() {
  const { state, connected, requestAmbulance, completeTrip } = useDashboardData();
  const [pendingLocation, setPendingLocation] = useState(null);

  if (!state) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
        <span>Connecting to triage backend…</span>
        {!connected && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Make sure the backend server is running on :4000
          </span>
        )}
      </div>
    );
  }

  const { hospital, callsQueue, ambulances } = state;

  return (
    <div className="min-h-full flex flex-col">
      <TopBar connected={connected} hospitalName={hospital.name} title="Ambulance dispatch" />

      <main className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-4 p-5 items-start">
        <div className="xl:col-span-2 flex flex-col gap-4">
          <Panel
            title="Ambulance dispatch"
            eyebrow="Priority-first · nearest-available matching"
            right={
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                {callsQueue.length} pending call{callsQueue.length === 1 ? '' : 's'}
              </span>
            }
          >
            <AmbulanceMap
              hospital={hospital}
              ambulances={ambulances}
              callsQueue={callsQueue}
              pendingLocation={pendingLocation}
              onPickLocation={setPendingLocation}
            />
            <div className="h-3.5" />
            <AmbulanceRequestForm
              pendingLocation={pendingLocation}
              onClearLocation={() => setPendingLocation(null)}
              onSubmit={async (payload) => {
                await requestAmbulance(payload);
                setPendingLocation(null);
              }}
            />
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel title="Fleet status" eyebrow={`${ambulances.length} ambulances`}>
            <AmbulanceFleet ambulances={ambulances} onCompleteTrip={completeTrip} />
          </Panel>
        </div>
      </main>
    </div>
  );
}