import { useState, useEffect, useCallback } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { endpoints } from '../api/client';
import Swal from 'sweetalert2';
import TopBar from '../components/TopBar';
import Panel from '../components/Panel';
import AmbulanceMap from '../components/AmbulanceMap';
import AmbulanceRequestForm from '../components/AmbulanceRequestForm';
import AmbulanceFleet from '../components/AmbulanceFleet';
import FleetStatusBar from '../components/FleetStatusBar';
import CallQueueList from '../components/CallQueueList';
import TripHistoryLog from '../components/TripHistoryLog';
import { History, ListTodo, XCircle } from 'lucide-react';

export default function AmbulancePage() {
  const { state, connected, requestAmbulance, completeTrip, cancelTrip, reassignTrip } = useDashboardData();
  const [pendingLocation, setPendingLocation] = useState(null);
  const [hospitals, setHospitals] = useState(null);
  const [selectedCallId, setSelectedCallId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showCallQueue, setShowCallQueue] = useState(true);

  useEffect(() => {
    if (!hospitals) {
      endpoints.getHospitals().then((res) => setHospitals(res.data)).catch(() => {});
    }
  }, [hospitals]);

  const handleCancelTrip = useCallback(async (ambulanceId) => {
    const { value: reason, isDismissed } = await Swal.fire({
      title: 'Cancel dispatch',
      text: 'Why are you cancelling this trip?',
      input: 'text',
      inputPlaceholder: 'e.g. Wrong unit assigned',
      showCancelButton: true,
      confirmButtonText: 'Cancel trip',
      cancelButtonText: 'Go back',
      confirmButtonColor: '#ef4444',
      inputValidator: (v) => { if (!v) return 'Please enter a reason'; },
    });
    if (isDismissed) return;
    await cancelTrip(ambulanceId, reason || 'Cancelled by dispatcher');
  }, [cancelTrip]);

  const handleReassignTrip = useCallback(async (ambulanceId) => {
    if (!state?.ambulances) return;
    const available = state.ambulances.filter(
      (a) => a.id !== ambulanceId && a.status === 'available'
    );
    if (available.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'No units available',
        text: 'There are no available units to reassign to.',
        confirmButtonColor: '#0d9488',
      });
      return;
    }
    const unitOptions = {};
    available.forEach((a) => { unitOptions[a.id] = `${a.name} ${a.type === 'als' ? '(ALS)' : '(BLS)'}`; });
    const { value: targetId, isDismissed } = await Swal.fire({
      title: 'Reassign trip',
      text: 'Select a unit to reassign this trip to:',
      input: 'select',
      inputOptions: unitOptions,
      showCancelButton: true,
      confirmButtonText: 'Reassign',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0d9488',
      inputValidator: (v) => { if (!v) return 'Please select a unit'; },
    });
    if (isDismissed || !targetId) return;
    await reassignTrip(ambulanceId, targetId);
  }, [state, reassignTrip]);

  const handleCancelCall = useCallback(async (callId) => {
    // TODO: Backend endpoint for cancelling a call from queue
    // For now, log it
    console.log('Cancel call:', callId);
  }, []);

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

  const { hospital, callsQueue, ambulances, stats } = state;

  const displayHospitals = hospitals || [hospital];

  return (
    <div className="min-h-full flex flex-col">
      <TopBar connected={connected} hospitalName={hospital.name} title="Ambulance dispatch" />

      <main className="flex-1 flex flex-col gap-4 p-5">
        {/* Fleet Status Bar */}
        <FleetStatusBar stats={stats} />

        {/* Main grid: Map + Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
          {/* Map area */}
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
                hospitals={displayHospitals}
              />
              <div className="h-3.5" />
              <AmbulanceRequestForm
                pendingLocation={pendingLocation}
                onClearLocation={() => setPendingLocation(null)}
                onSubmit={async (payload) => {
                  await requestAmbulance(payload);
                  setPendingLocation(null);
                }}
                hospitals={displayHospitals}
              />
            </Panel>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Toggle buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => { setShowCallQueue(true); setShowHistory(false); }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium border transition-colors ${
                  showCallQueue && !showHistory
                    ? 'bg-teal-500/10 border-brand-light dark:border-brand-dark text-brand-light dark:text-brand-dark'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                <ListTodo size={14} /> Call queue
              </button>
              <button
                onClick={() => { setShowHistory(true); setShowCallQueue(false); }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium border transition-colors ${
                  showHistory && !showCallQueue
                    ? 'bg-teal-500/10 border-brand-light dark:border-brand-dark text-brand-light dark:text-brand-dark'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                <History size={14} /> Trip history
              </button>
            </div>

            {/* Fleet panel */}
            <Panel
              title="Fleet status"
              eyebrow={`${ambulances.length} ambulances · ${stats?.available || 0} available`}
            >
              <AmbulanceFleet
                ambulances={ambulances}
                onCompleteTrip={completeTrip}
                onCancelTrip={handleCancelTrip}
                onReassignTrip={handleReassignTrip}
                otherAmbulances={ambulances.filter((a) => a.status === 'available')}
              />
            </Panel>

            {/* Call Queue or Trip History */}
            {showCallQueue && (
              <Panel
                title="Pending calls"
                eyebrow={`${callsQueue.length} waiting`}
              >
                <CallQueueList
                  callsQueue={callsQueue}
                  onSelectCall={setSelectedCallId}
                  selectedCallId={selectedCallId}
                  onFlyToCall={(lat, lng) => {
                    // Map fly-to would need map ref; for now log
                    console.log('Fly to:', lat, lng);
                  }}
                  onCancelCall={handleCancelCall}
                />
              </Panel>
            )}

            {showHistory && (
              <Panel title="Trip history" eyebrow="Completed trips">
                <TripHistoryLog />
              </Panel>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
