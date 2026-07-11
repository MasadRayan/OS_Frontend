import { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import TopBar from '../components/TopBar';
import Panel from '../components/Panel';
import AdmitPatientForm from '../components/AdmitPatientForm';
import PatientQueue from '../components/PatientQueue';
import ResourcePanel from '../components/ResourcePanel';
import AmbulanceMap from '../components/AmbulanceMap';
import AmbulanceRequestForm from '../components/AmbulanceRequestForm';
import AmbulanceFleet from '../components/AmbulanceFleet';
import MetricsPanel from '../components/MetricsPanel';
import EventLog from '../components/EventLog';

export default function OverviewPage() {
  const {
    state,
    connected,
    admitPatient,
    treatNextPatient,
    dischargePatient,
    requestAmbulance,
    completeTrip,
  } = useDashboardData();
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

  const { hospital, waitingQueue, admitted, resources, callsQueue, ambulances, metrics, eventLog } = state;

  return (
    <div className="min-h-full flex flex-col">
      <TopBar connected={connected} hospitalName={hospital.name} title="Overview" />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-5 items-start">
        {/* Column 1: Admission + Waiting Queue */}
        <div className="flex flex-col gap-4">
          <Panel title="Admit patient" eyebrow="Step 1">
            <AdmitPatientForm onSubmit={admitPatient} />
          </Panel>

          <Panel
            title="Waiting list"
            eyebrow="Preemptive priority · aging enabled"
            right={
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                {waitingQueue.length} waiting
              </span>
            }
          >
            <PatientQueue patients={waitingQueue} onTreatNext={treatNextPatient} />
          </Panel>
        </div>

        {/* Column 2: Resources (Banker's Algorithm) */}
        <div className="flex flex-col gap-4">
          <Panel title="Hospital resources" eyebrow="Banker's Algorithm · safe-state admission">
            <ResourcePanel resources={resources} admitted={admitted} onDischarge={dischargePatient} />
          </Panel>

          <Panel title="Activity" eyebrow="Live event feed">
            <EventLog events={eventLog} />
          </Panel>
        </div>

        {/* Column 3: Ambulance dispatch */}
        <div className="flex flex-col gap-4">
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

          <Panel title="Fleet status" eyebrow={`${ambulances.length} ambulances`}>
            <AmbulanceFleet ambulances={ambulances} onCompleteTrip={completeTrip} />
          </Panel>
        </div>

        <div className="lg:col-span-3">
          <Panel title="Performance" eyebrow="Fairness, throughput & wait-time analysis">
            <MetricsPanel metrics={metrics} />
          </Panel>
        </div>
      </main>
    </div>
  );
}
