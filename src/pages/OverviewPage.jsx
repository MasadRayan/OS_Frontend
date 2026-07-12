import { useDashboardData } from '../hooks/useDashboardData';
import { useSchedulerConfig } from '../hooks/useSchedulerConfig';
import { getAlgorithmInfo } from '../lib/algorithmInfo';
import TopBar from '../components/TopBar';
import Panel from '../components/Panel';
import AdmitPatientForm from '../components/AdmitPatientForm';
import PatientQueue from '../components/PatientQueue';
import ResourcePanel from '../components/ResourcePanel';
import MetricsPanel from '../components/MetricsPanel';
import EventLog from '../components/EventLog';
import SchedulerSelector from '../components/SchedulerSelector';

export default function OverviewPage() {
  const {
    state,
    connected,
    admitPatient,
    treatNextPatient,
    dischargePatient,
    transferToIcu,
  } = useDashboardData();
  const schedulerInfo = state?.scheduler;
  const { config, loading, setAlgorithm } = useSchedulerConfig(schedulerInfo);

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
  const availableAmbulances = ambulances.filter((amb) => amb.status === 'available').length;

  const overviewStats = [
    { label: 'Waiting', value: waitingQueue.length, sub: 'patients in queue' },
    { label: 'Admitted', value: admitted.length, sub: 'active cases' },
    { label: 'Calls', value: callsQueue.length, sub: 'pending ambulance requests' },
    { label: 'Fleet', value: ambulances.length, sub: `${availableAmbulances} available now` },
  ];

  return (
    <div className="min-h-full flex flex-col">
      <TopBar connected={connected} hospitalName={hospital.name} title="Patient Admit" />

      <main className="flex-1 flex flex-col gap-4 p-5">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-[#16212c] px-5 py-5 shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.12),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.1),transparent_35%)]" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
                Emergency operations
              </div>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                {hospital.name}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Monitor triage flow, bed pressure, and live throughput from one clean control surface.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0f1720] px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
              <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              {connected ? 'Live backend connected' : 'Reconnecting to backend'}
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-2 xl:grid-cols-4 gap-3">
            {overviewStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-[#1d2b39] px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.04)]"
              >
                <div className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">{stat.label}</div>
                <div className="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                <div className="mt-0.5 text-[10.5px] text-slate-400 dark:text-slate-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between bg-white dark:bg-[#16212c] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Active scheduler:{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {getAlgorithmInfo(schedulerInfo?.activeAlgorithm).name}
            </span>
          </div>
          <SchedulerSelector config={config} onSetAlgorithm={setAlgorithm} loading={loading} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Column 1: Admission + Waiting Queue */}
        <div className="flex flex-col gap-4 xl:col-span-4">
          <Panel title="Admit patient" eyebrow="Step 1">
            <AdmitPatientForm onSubmit={admitPatient} />
          </Panel>

          <Panel
            title="Waiting list"
            eyebrow={`${getAlgorithmInfo(schedulerInfo?.activeAlgorithm).shortName} · ${schedulerInfo?.activeAlgorithm === 'preemptivePriority' ? 'aging enabled' : schedulerInfo?.activeAlgorithm === 'mlfq' ? 'multi-queue' : schedulerInfo?.activeAlgorithm === 'roundRobin' ? 'time-sliced' : schedulerInfo?.activeAlgorithm === 'edf' ? 'deadline-driven' : 'active'}`}
            right={
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                {waitingQueue.length} waiting
              </span>
            }
          >
            <PatientQueue patients={waitingQueue} onTreatNext={treatNextPatient} algorithmName={getAlgorithmInfo(schedulerInfo?.activeAlgorithm).shortName} />
          </Panel>
        </div>

        {/* Column 2: Resources (Banker's Algorithm) */}
        <div className="flex flex-col gap-4 xl:col-span-4">
          <Panel title="Hospital resources" eyebrow="Banker's Algorithm · safe-state admission">
            <ResourcePanel resources={resources} admitted={admitted} onDischarge={dischargePatient} onTransferToIcu={transferToIcu} />
          </Panel>

          <Panel title="Activity" eyebrow="Live event feed">
            <EventLog events={eventLog} />
          </Panel>
        </div>

        <div className="flex flex-col gap-4 xl:col-span-4 xl:sticky xl:top-5">
          <Panel title="Performance" eyebrow="Fairness, throughput & wait-time analysis">
            <MetricsPanel metrics={metrics} />
          </Panel>
        </div>
        </div>
      </main>
    </div>
  );
}
