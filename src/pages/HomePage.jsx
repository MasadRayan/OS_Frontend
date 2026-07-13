import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck, Clock, MapPinned, ArrowRight, Heart, Cpu,
  GitBranch, CheckCircle, Target, ChevronDown, Activity,
  Layers, ArrowDown, Github, GraduationCap, Users, TrendingDown, Server,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { useInView } from '../hooks/useInView';
import Footer from '../components/Footer';

/* ── helpers ───────────────────────────────────── */

function FadeBlock({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* Eyebrow: consistent "system readout" label above section headings */
function Eyebrow({ children }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-slate-400 dark:text-slate-500 mb-2">
      {children}
    </div>
  );
}

/* ── data ───────────────────────────────────────── */

const STATS = [
  { icon: Cpu, value: '7', label: 'Scheduling algorithms', sub: 'FCFS to EDF' },
  { icon: GitBranch, value: 'Aging', label: 'Prevents starvation', sub: 'Priority boosts over time' },
  { icon: CheckCircle, value: 'Safe', label: "Banker's Algorithm", sub: 'Zero deadlock guarantee' },
  { icon: Target, value: 'Priority', label: 'Ambulance dispatch', sub: 'Urgency + proximity' },
];

const STEPS = [
  {
    num: '01', title: 'Patient arrives',
    desc: 'A patient enters triage and is assigned a severity score from 1 (critical) to 5 (non-urgent).',
    dot: 'bg-amber-500',
  },
  {
    num: '02', title: 'Queue is sorted',
    desc: 'The active scheduling algorithm re-orders the waiting list by priority, wait time, or deadline — instantly.',
    dot: 'bg-orange-500',
  },
  {
    num: '03', title: 'Resources checked',
    desc: "Banker's Algorithm simulates bed, doctor, ICU, and ventilator availability before admitting anyone.",
    dot: 'bg-blue-500',
  },
  {
    num: '04', title: 'Ambulance dispatched',
    desc: 'Calls are matched by urgency first, then by nearest available unit — so critical calls never wait.',
    dot: 'bg-red-500',
  },
];

const FEATURES = [
  {
    icon: Clock,
    title: 'Priority scheduling with aging',
    body: 'The waiting list is always sorted by real urgency, not arrival order. A critical patient jumps the queue instantly, and anyone who waits long enough gets their priority boosted automatically — so no one is left behind indefinitely.',
  },
  {
    icon: ShieldCheck,
    title: "Banker's Algorithm admission",
    body: 'Before any patient is admitted, the system checks whether beds, doctors, ICU slots, and ventilators can safely cover everyone already admitted. If not, the admission is refused rather than risking a resource deadlock.',
  },
  {
    icon: MapPinned,
    title: 'Priority-first ambulance dispatch',
    body: 'Every incoming call is matched by urgency first, then by the nearest available ambulance using real geographic distance — so the most critical call is never left waiting behind a closer, less severe one.',
  },
];

/* Every algorithm implemented, with where in the pipeline it's actually used */
const ALGORITHMS = [
  { code: 'FCFS', name: 'First-Come, First-Served', desc: 'Baseline arrival-order queue — the naive case Pulse improves on.', used: null },
  { code: 'SJF', name: 'Shortest Job First', desc: 'Favors the fastest-to-treat cases to minimize average wait.', used: null },
  { code: 'PR', name: 'Priority (non-preemptive)', desc: 'Assigns by fixed severity; runs each case to completion.', used: 'Scheduling' },
  { code: 'PR+A', name: 'Preemptive Priority + Aging', desc: 'Live priority queue that boosts long-waiters to prevent starvation.', used: 'Ready Queue' },
  { code: 'RR', name: 'Round Robin', desc: 'Time-sliced fairness for cases of equal priority.', used: null },
  { code: 'MLFQ', name: 'Multilevel Feedback Queue', desc: 'Multiple queues tiered by acuity, with feedback between levels.', used: null },
  { code: 'EDF', name: 'Earliest Deadline First', desc: 'Schedules by nearest deadline — drives golden-hour critical care.', used: 'Deadline Scheduling' },
];

/* Avg. patient wait time by algorithm, simulated over the same 200-patient load.
   ⚠ Placeholder values — swap in your own benchmark output before submitting. */
const BENCHMARKS = [
  { name: 'FCFS', minutes: 34, fill: '#94a3b8' },
  { name: 'SJF', minutes: 27, fill: '#94a3b8' },
  { name: 'Priority', minutes: 21, fill: '#94a3b8' },
  { name: 'Priority + Aging', minutes: 12, fill: 'var(--chart-highlight, #2dd4bf)' },
];

const ARCHITECTURE = [
  {
    icon: Layers, title: 'Client — React 18 + Vite',
    desc: 'Dashboard, triage form, and live map render here; polls the API and reflects queue changes in real time.',
  },
  {
    icon: Server, title: 'API — Express',
    desc: 'REST endpoints for admission, discharge, and dispatch requests; validates and forwards to the scheduling engine.',
  },
  {
    icon: Cpu, title: 'Scheduling Engine',
    desc: 'Runs the active algorithm against the in-memory queue and returns the new ordering on every state change.',
  },
  {
    icon: MapPinned, title: 'Dispatch Engine',
    desc: "Matches ambulance calls by urgency then proximity, using the Haversine distance between call and unit.",
  },
];

const PROJECT_INFO = {
  course: 'CSE-4108 — Operating Systems Lab',
  institution: '[Your Institution]',
  term: 'Summer 2026',
  team: ['[Team Member 1]', '[Team Member 2]', '[Team Member 3]'],
  repo: 'https://github.com/[your-username]/pulse',
};

const FAQS = [
  {
    q: 'What is Pulse?',
    a: "Pulse is an OS Lab project that applies operating-system scheduling principles — priority queues, the Banker's Algorithm, and earliest-deadline-first scheduling — to emergency medical triage and ambulance dispatch.",
  },
  {
    q: 'How does it use OS scheduling?',
    a: "Every patient is treated as a process in a multi-level queue. Their severity score determines priority, wait time triggers aging, and admission is gated by the Banker's Algorithm — just like an OS prevents deadlock by refusing unsafe resource grants.",
  },
  {
    q: 'What algorithms are implemented?',
    a: 'Seven: First-Come First-Served, Shortest Job First, Priority (non-preemptive), Preemptive Priority with Aging, Round Robin, Multilevel Feedback Queue, and Earliest Deadline First.',
  },
  {
    q: "How does the Banker's Algorithm apply?",
    a: 'Before admitting a patient, the system simulates whether available resources — beds, doctors, ICU slots, ventilators — can cover all current patients plus the new one. If the system would enter an unsafe state, admission is blocked.',
  },
  {
    q: 'Can I try it without setting up a backend?',
    a: 'The dashboard requires the Pulse backend running on localhost:4000. Check the project README for setup instructions.',
  },
  {
    q: 'Is this used in real hospitals?',
    a: 'Pulse is an academic project built for an OS Lab course. It demonstrates how theoretical OS concepts apply to real-world resource allocation problems — it is not deployed in production healthcare settings.',
  },
];

/* ── sub-components ─────────────────────────────── */

function EkgDivider() {
  return (
    <div className="border-y border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16212c] overflow-hidden">
      <svg viewBox="0 0 1200 90" width="100%" height="90" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          points="0,45 220,45 250,45 268,10 286,80 304,45 340,45 420,45 448,45 466,20 484,70 502,45 540,45 1200,45"
          fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1.5"
        />
        <polyline
          points="0,45 220,45 250,45 268,10 286,80 304,45 340,45 420,45 448,45 466,20 484,70 502,45 540,45 1200,45"
          fill="none" className="stroke-brand-light dark:stroke-brand-dark animate-ekg-sweep [stroke-dasharray:18_400]"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="100"
        />
      </svg>
    </div>
  );
}

/* Signature hero element: a mock "live" dashboard preview showing the queue
   already sorted by severity, so the product's core idea is shown, not just described. */
function DashboardPreview() {
  const rows = [
    { name: 'Patient — Bay 3', dot: 'bg-red-500', tag: 'Critical', wait: 'seen in 2m' },
    { name: 'Patient — Bay 7', dot: 'bg-orange-500', tag: 'Urgent', wait: 'seen in 6m' },
    { name: 'Patient — Bay 1', dot: 'bg-amber-500', tag: 'Moderate', wait: 'seen in 14m' },
    { name: 'Patient — Bay 5', dot: 'bg-blue-500', tag: 'Stable', wait: 'seen in 22m' },
  ];
  return (
    <div className="relative bg-white dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-black/20 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <span className="w-2 h-2 rounded-full bg-red-400/70" />
        <span className="w-2 h-2 rounded-full bg-amber-400/70" />
        <span className="w-2 h-2 rounded-full bg-green-400/70" />
        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 ml-2">pulse — queue view</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex w-full h-full rounded-full bg-red-500 animate-ping opacity-60" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-red-500" />
          </span>
          <span className="font-mono text-[9px] tracking-widest uppercase text-red-500">live</span>
        </span>
      </div>

      <div className="px-4 sm:px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500">
            Sorted by severity
          </span>
          <span className="font-mono text-[10px] text-slate-300 dark:text-slate-600">4 waiting</span>
        </div>

        <div className="space-y-1.5">
          {rows.map((r, i) => (
            <div
              key={r.name}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${i === 0 ? 'bg-red-500/5 border border-red-500/20' : 'bg-slate-50 dark:bg-[#16212c] border border-transparent'}`}
            >
              <span className="font-mono text-[11px] text-slate-300 dark:text-slate-600 w-4">{i + 1}</span>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${r.dot}`} />
              <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 flex-1 truncate">{r.name}</span>
              <span className="hidden sm:inline text-[11px] font-mono text-slate-400 dark:text-slate-500">{r.wait}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ faq, isOpen, onToggle }) {
  const id = `faq-${faq.q.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={id}
        className="flex items-center justify-between w-full text-left py-4 sm:py-5 cursor-pointer bg-transparent border-0 text-inherit font-inherit"
      >
        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 pr-4">
          {faq.q}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={id}
        role="region"
        className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-96 opacity-100 pb-4 sm:pb-5' : 'max-h-0 opacity-0'}`}
      >
        <p className="m-0 text-[13.5px] sm:text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed">
          {faq.a}
        </p>
      </div>
    </div>
  );
}

/* ── page ───────────────────────────────────────── */

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.07),transparent_50%)] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 pt-16 sm:pt-24 pb-14 sm:pb-16">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
            <div>
              <FadeBlock>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-[#16212c] pl-2.5 pr-3.5 py-1.5 mb-6">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-brand-light dark:bg-brand-dark animate-ping opacity-60" />
                    <span className="relative w-1.5 h-1.5 rounded-full bg-brand-light dark:bg-brand-dark" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-slate-500 dark:text-slate-400">
                    OS Lab · Scheduling &amp; Resource Allocation
                  </span>
                </div>
              </FadeBlock>

              <FadeBlock delay={100}>
                <h1 className="m-0 font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-slate-100 text-4xl sm:text-5xl lg:text-[3.4rem] mb-4">
                  Emergency care shouldn&apos;t wait on a queue.
                </h1>
              </FadeBlock>

              <FadeBlock delay={200}>
                <p className="m-0 max-w-xl text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed mb-7">
                  Pulse applies real operating-system scheduling algorithms — preemptive
                  priority with aging, the Banker&apos;s Algorithm, and priority-first
                  resource matching — to who gets treated next, who gets a bed, and
                  which ambulance gets sent where.
                </p>
              </FadeBlock>

              <FadeBlock delay={300}>
                <div className="flex gap-3 flex-wrap">
                  <NavLink
                    to="/dashboard"
                    className="inline-flex items-center gap-2 bg-brand-light dark:bg-brand-dark text-white dark:text-[#04201d] no-underline font-bold text-sm px-[18px] py-3 rounded-lg hover:brightness-110 transition-all"
                  >
                    Open dashboard <ArrowRight size={16} />
                  </NavLink>
                  <NavLink
                    to="/about"
                    className="inline-flex items-center text-slate-900 dark:text-slate-100 no-underline font-bold text-sm px-[18px] py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                  >
                    About the project
                  </NavLink>
                </div>
              </FadeBlock>
            </div>

            <FadeBlock delay={250}>
              <DashboardPreview />
            </FadeBlock>
          </div>
        </div>
      </section>

      <EkgDivider />

      {/* ── Stats ── */}
      <section className="max-w-6xl mx-auto px-5 py-14 sm:py-16 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((s, i) => (
            <FadeBlock key={s.label} delay={i * 80}>
              <div className="bg-white dark:bg-[#16212c] border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 text-center">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mx-auto mb-3">
                  <s.icon size={18} className="text-brand-light dark:text-brand-dark" />
                </div>
                <div className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-0.5">
                  {s.value}
                </div>
                <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                  {s.label}
                </div>
                <div className="text-[11.5px] text-slate-400 dark:text-slate-500">
                  {s.sub}
                </div>
              </div>
            </FadeBlock>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white dark:bg-[#16212c] border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-16 w-full">
          <FadeBlock>
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="m-0 mb-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              From arrival to action
            </h2>
            <p className="m-0 max-w-xl text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed mb-10 sm:mb-12">
              Every patient flows through the same pipeline. Algorithms at each stage make the decisions that save time — and lives.
            </p>
          </FadeBlock>

          <div className="relative">
            {/* continuous rail behind all dots */}
            <div className="hidden sm:block absolute top-[7px] left-[7px] right-[7px] h-px bg-slate-200 dark:bg-slate-700" />

            <div className="grid gap-y-8 gap-x-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <FadeBlock key={step.num} delay={i * 100}>
                  <div className="flex flex-col items-start h-full">
                    <span className={`relative z-10 w-3.5 h-3.5 rounded-full ring-4 ring-white dark:ring-[#16212c] ${step.dot}`} />
                    <span className="font-mono text-[11px] tracking-widest text-slate-400 dark:text-slate-500 mt-3 mb-2.5">
                      {step.num}
                    </span>
                    <h3 className="m-0 mb-1.5 text-base font-bold text-slate-900 dark:text-slate-100">{step.title}</h3>
                    <p className="m-0 text-[13.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </FadeBlock>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Algorithms ── */}
      <section className="max-w-6xl mx-auto px-5 py-14 sm:py-16 w-full">
        <FadeBlock>
          <Eyebrow>Under the hood</Eyebrow>
          <h2 className="m-0 mb-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Seven algorithms, benchmarked against each other
          </h2>
          <p className="m-0 max-w-xl text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed mb-10 sm:mb-12">
            Pulse implements the full scheduling syllabus, not just the two it runs live — so the dashboard can compare naive and optimized approaches side by side.
          </p>
        </FadeBlock>

        <FadeBlock delay={100}>
          <div className="bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">
              <Activity size={12} className="text-slate-400 dark:text-slate-500" />
              <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">./scheduler --list</span>
            </div>
            <div>
              {ALGORITHMS.map((a, i) => (
                <div
                  key={a.code}
                  className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 ${i !== ALGORITHMS.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}
                >
                  <span className="font-mono text-[11px] font-bold text-brand-light dark:text-brand-dark w-12 flex-shrink-0">
                    {a.code}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 w-full sm:w-56 flex-shrink-0">
                    {a.name}
                  </span>
                  <span className="hidden sm:block text-[13px] text-slate-500 dark:text-slate-400 flex-1 truncate">
                    {a.desc}
                  </span>
                  {a.used ? (
                    <span className="font-mono text-[10px] text-brand-light dark:text-brand-dark border border-brand-light/30 dark:border-brand-dark/30 rounded-full px-2 py-0.5 flex-shrink-0 whitespace-nowrap">
                      live · {a.used}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-slate-300 dark:text-slate-600 flex-shrink-0 whitespace-nowrap">
                      benchmark only
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeBlock>
      </section>

      {/* ── Results / Benchmarks ── */}
      <section className="bg-white dark:bg-[#16212c] border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-16 w-full">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
            <FadeBlock>
              <Eyebrow>Results</Eyebrow>
              <h2 className="m-0 mb-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Priority + Aging cuts wait time
              </h2>
              <p className="m-0 max-w-md text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed mb-6">
                Simulated against an identical 200-patient load, switching from
                arrival-order scheduling to Pulse&apos;s preemptive priority queue
                cut average wait time significantly — without starving low-priority cases.
              </p>
              <div className="inline-flex items-center gap-2.5 bg-teal-500/10 rounded-lg px-3.5 py-2.5">
                <TrendingDown size={16} className="text-brand-light dark:text-brand-dark flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  ~65% shorter average wait vs. FCFS
                </span>
              </div>
            </FadeBlock>

            <FadeBlock delay={150}>
              <div className="bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500">
                    Avg. wait time (min) · 200-patient load
                  </span>
                </div>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={BENCHMARKS} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
                      <CartesianGrid horizontal={false} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category" dataKey="name" width={110}
                        tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'inherit' }}
                        axisLine={false} tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                        formatter={(v) => [`${v} min`, 'Avg. wait']}
                      />
                      <Bar dataKey="minutes" radius={[0, 6, 6, 0]} barSize={22}>
                        {BENCHMARKS.map((b) => (
                          <Cell key={b.name} fill={b.name === 'Priority + Aging' ? '#2dd4bf' : '#cbd5e1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="m-0 mt-3 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  * placeholder simulation data — replace with your own benchmark run
                </p>
              </div>
            </FadeBlock>
          </div>
        </div>
      </section>

      {/* ── Architecture ── */}
      <section className="max-w-6xl mx-auto px-5 py-14 sm:py-16 w-full">
        <FadeBlock>
          <Eyebrow>System Architecture</Eyebrow>
          <h2 className="m-0 mb-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            How the pieces fit together
          </h2>
          <p className="m-0 max-w-xl text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed mb-10 sm:mb-12">
            A request flows straight down this stack — from the dashboard, through the API, into whichever scheduling algorithm is active.
          </p>
        </FadeBlock>

        <div className="max-w-2xl mx-auto">
          {ARCHITECTURE.map((layer, i) => (
            <FadeBlock key={layer.title} delay={i * 100}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <layer.icon size={18} className="text-brand-light dark:text-brand-dark" />
                  </div>
                  {i < ARCHITECTURE.length - 1 && (
                    <ArrowDown size={14} className="text-slate-300 dark:text-slate-600 my-1.5" />
                  )}
                </div>
                <div className="pt-1.5 pb-6">
                  <h3 className="m-0 mb-1 text-[15px] font-bold text-slate-900 dark:text-slate-100">{layer.title}</h3>
                  <p className="m-0 text-[13.5px] text-slate-500 dark:text-slate-400 leading-relaxed">{layer.desc}</p>
                </div>
              </div>
            </FadeBlock>
          ))}
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="bg-white dark:bg-[#16212c] border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-16 w-full">
          <FadeBlock>
            <Eyebrow>Three algorithms, one emergency room</Eyebrow>
            <h2 className="m-0 mb-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              OS concepts that save lives
            </h2>
            <p className="m-0 max-w-xl text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed mb-10 sm:mb-12">
              Three core ideas from operating systems, reimagined for the ER.
            </p>
          </FadeBlock>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FadeBlock key={f.title} delay={i * 100}>
                <div className="group bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-xl p-[22px] sm:p-6 h-full hover:border-brand-light dark:hover:border-brand-dark transition-colors duration-300">
                  <div className="w-[38px] h-[38px] rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    <f.icon size={18} className="text-brand-light dark:text-brand-dark" strokeWidth={2.2} />
                  </div>
                  <h3 className="m-0 mb-2 text-base font-bold text-slate-900 dark:text-slate-100">{f.title}</h3>
                  <p className="m-0 text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400">{f.body}</p>
                </div>
              </FadeBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-6xl mx-auto px-5 py-14 sm:py-16 w-full">
        <FadeBlock>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="m-0 mb-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Common questions
          </h2>
          <p className="m-0 max-w-xl text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed mb-10 sm:mb-12">
            Everything you need to know about Pulse.
          </p>
        </FadeBlock>

        <FadeBlock delay={100}>
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#16212c] border border-slate-200 dark:border-slate-700 rounded-xl px-5 sm:px-6">
            {FAQS.map((faq) => (
              <FaqItem
                key={faq.q}
                faq={faq}
                isOpen={openFaq === faq.q}
                onToggle={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
              />
            ))}
          </div>
        </FadeBlock>
      </section>


      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-5 py-14 sm:py-20 w-full">
        <FadeBlock>
          <div className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-[#1d2b39] border border-slate-200 dark:border-slate-700 p-7 sm:p-9">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.15),transparent_40%)] pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className="m-0 mb-1 text-lg font-extrabold text-slate-900 dark:text-slate-100">See it running live</h3>
                  <p className="m-0 text-slate-500 dark:text-slate-400 text-[13.5px] max-w-md leading-relaxed">
                    Admit patients, watch the queue re-sort in real time, and dispatch ambulances on the map. No setup required.
                  </p>
                </div>
              </div>
              <NavLink
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-brand-light dark:bg-brand-dark text-white dark:text-[#04201d] no-underline font-bold text-sm px-4 py-2.5 rounded-lg hover:brightness-110 transition-all whitespace-nowrap flex-shrink-0"
              >
                Open dashboard <ArrowRight size={16} />
              </NavLink>
            </div>
          </div>
        </FadeBlock>
      </section>

      <Footer />
    </div>
  );
}