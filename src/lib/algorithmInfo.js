export const ALGORITHM_INFO = {
  fcfs: {
    id: 'fcfs',
    name: 'First-Come, First-Served',
    shortName: 'FCFS',
    description: 'Patients are treated in order of arrival — the earliest arrival is served first.',
    osConcept: 'Non-preemptive FIFO queue; the simplest CPU scheduling algorithm.',
    fields: ['sortKey (arrivalTime)'],
  },
  sjf: {
    id: 'sjf',
    name: 'Shortest Job First',
    shortName: 'SJF',
    description: 'Patients with the shortest expected treatment time are treated first.',
    osConcept: 'Non-preemptive; minimizes average wait time but can cause starvation for long bursts.',
    fields: ['sortKey', 'burstMinutes'],
  },
  priority: {
    id: 'priority',
    name: 'Priority (Non-preemptive)',
    shortName: 'Priority',
    description: 'Patients are treated strictly by triage severity (1 = most urgent).',
    osConcept: 'Pure fixed-priority scheduling; lower-severity patients may starve.',
    fields: ['sortKey', 'effectivePriority'],
  },
  preemptivePriority: {
    id: 'preemptivePriority',
    name: 'Preemptive Priority with Aging',
    shortName: 'Preemptive Priority',
    description: 'Priority-based with aging: waiting patients gradually increase in effective priority to prevent starvation.',
    osConcept: 'Aging prevents starvation (like Linux priority aging). A newly arrived critical patient can preempt.',
    fields: ['sortKey', 'effectivePriority', 'aged'],
    params: {
      agingIntervalMin: { label: 'Aging interval (min)', type: 'number', min: 1, max: 30, step: 1 },
      agingStep: { label: 'Aging step', type: 'number', min: 0.1, max: 3, step: 0.1 },
    },
  },
  roundRobin: {
    id: 'roundRobin',
    name: 'Round Robin',
    shortName: 'Round Robin',
    description: 'Each patient gets a time quantum; if not admitted within that quantum, they cycle to the back.',
    osConcept: 'Preemptive time-slicing; fair but context-switch overhead. Used in time-sharing systems.',
    fields: ['sortKey', 'lastServedAt', 'quantumElapsed'],
    params: {
      quantumMinutes: { label: 'Quantum (minutes)', type: 'number', min: 1, max: 10, step: 1 },
    },
  },
  mlfq: {
    id: 'mlfq',
    name: 'Multilevel Feedback Queue',
    shortName: 'MLFQ',
    description: 'Multiple queues by severity level; patients are promoted to higher-priority queues if they wait too long at their level.',
    osConcept: 'MLFQ (used in BSD Unix); balances fairness with priority by dynamically promoting waiting processes.',
    fields: ['sortKey', 'currentLevel', 'originalLevel', 'promoted'],
    params: {
      quantumByLevel: { label: 'Quantum per level (JSON)', type: 'json' },
    },
  },
  edf: {
    id: 'edf',
    name: 'Earliest Deadline First',
    shortName: 'EDF',
    description: 'Patients with the closest golden-hour deadline are treated first.',
    osConcept: 'Real-time scheduling; dynamic priority based on deadline proximity. Optimal for meeting all deadlines.',
    fields: ['sortKey (deadlineAt)'],
  },
};

export const ALGORITHM_ORDER = ['fcfs', 'sjf', 'priority', 'preemptivePriority', 'roundRobin', 'mlfq', 'edf'];

export function getAlgorithmInfo(id) {
  return ALGORITHM_INFO[id] || ALGORITHM_INFO.fcfs;
}

export function getAlgorithmName(id) {
  const info = ALGORITHM_INFO[id];
  return info ? info.name : id;
}

export function getAlgorithmShortName(id) {
  const info = ALGORITHM_INFO[id];
  return info ? info.shortName : id;
}
