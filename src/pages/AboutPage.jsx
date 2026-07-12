import { NavLink } from 'react-router-dom';
import { ArrowRight, Activity, Braces, Server, LayoutDashboard, Heart } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import Footer from '../components/Footer';

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

const MAPPINGS = [
  {
    num: '01',
    os: 'Ready Queue',
    er: 'Waiting Room',
    osDesc: 'Processes waiting for CPU time are held in a ready queue, ordered by priority.',
    erDesc: 'Arriving patients enter a waiting list sorted by triage severity score (1–5).',
    algo: 'Multi-level priority queue with aging',
    dotColor: 'bg-amber-500',
  },
  {
    num: '02',
    os: 'Scheduling',
    er: 'Triage Assessment',
    osDesc: 'The scheduler selects the highest-priority process from the ready queue.',
    erDesc: 'A triage nurse evaluates each patient and assigns a severity level.',
    algo: 'Preemptive Priority / Shortest Job First',
    dotColor: 'bg-orange-500',
  },
  {
    num: '03',
    os: 'Resource Allocation',
    er: 'Bed Assignment',
    osDesc: "Banker's Algorithm checks if granting a resource request leaves the system safe.",
    erDesc: 'Before admission, the system checks bed, doctor, ICU, and ventilator capacity.',
    algo: "Banker's Algorithm (deadlock avoidance)",
    dotColor: 'bg-blue-500',
  },
  {
    num: '04',
    os: 'Deadline Scheduling',
    er: 'Golden Hour',
    osDesc: 'EDF schedules tasks by their nearest deadline to maximize on-time completion.',
    erDesc: 'Critical patients have a golden hour — sooner treatment means better outcomes.',
    algo: 'Earliest Deadline First',
    dotColor: 'bg-red-500',
  },
];

const STACK = [
  { icon: Braces, label: 'React 18 + Vite 5', sub: 'Component framework and build tool', pid: '4102' },
  { icon: LayoutDashboard, label: 'Tailwind CSS 3 + Recharts', sub: 'Utility-first styling and charting', pid: '4118' },
  { icon: Activity, label: 'Leaflet + Axios', sub: 'Interactive maps and API client layer', pid: '4127' },
  { icon: Server, label: 'Express + Scheduling Engine', sub: '7 OS algorithms implemented server-side', pid: '4133' },
];

const PIPELINE = [
  { num: '1', er: 'Triage Assessment', algo: 'severity score 1–5', dotColor: 'bg-amber-500' },
  { num: '2', er: 'Priority Queue', algo: 'sorted by severity + wait time', dotColor: 'bg-orange-500' },
  { num: '3', er: 'Admission Check', algo: "Banker's Algorithm safe-state", dotColor: 'bg-blue-500' },
  { num: '4', er: 'Treatment / ICU', algo: 'EDF golden-window monitoring', dotColor: 'bg-red-500' },
  { num: '5', er: 'Discharge', algo: 'process terminated', dotColor: 'bg-green-500' },
];

function EkgDivider() {
  return (
    <div className="border-y border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16212c] overflow-hidden">
      <svg viewBox="0 0 1200 90" width="100%" height="90" preserveAspectRatio="none" aria-hidden="true">
        <polyline points="0,45 220,45 250,45 268,10 286,80 304,45 340,45 420,45 448,45 466,20 484,70 502,45 540,45 1200,45" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1.5" />
        <polyline points="0,45 220,45 250,45 268,10 286,80 304,45 340,45 420,45 448,45 466,20 484,70 502,45 540,45 1200,45" fill="none" className="stroke-brand-light dark:stroke-brand-dark animate-ekg-sweep [stroke-dasharray:18_400]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="100" />
      </svg>
    </div>
  );
}

/* Eyebrow: consistent "system readout" label used above every section heading */
function Eyebrow({ children, dot }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-slate-600 dark:text-slate-500">
        {children}
      </span>
    </div>
  );
}

/* Tiny visual for the Problem section: FCFS queue vs priority queue */
function QueueCompare() {
  const fcfs = [
    { label: 'Stubbed toe', tone: 'bg-slate-300 dark:bg-slate-600' },
    { label: 'Sprained wrist', tone: 'bg-slate-300 dark:bg-slate-600' },
    { label: 'Heart attack', tone: 'bg-red-500' },
  ];
  const priority = [
    { label: 'Heart attack', tone: 'bg-red-500' },
    { label: 'Sprained wrist', tone: 'bg-slate-300 dark:bg-slate-600' },
    { label: 'Stubbed toe', tone: 'bg-slate-300 dark:bg-slate-600' },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-3 mt-8 max-w-xl">
      <div className="bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-600 dark:text-slate-500 mb-3">
          Arrival order · FCFS
        </div>
        <div className="space-y-1.5">
          {fcfs.map((p, i) => (
            <div key={p.label} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.tone}`} />
              <span className={`text-[13px] font-mono ${i === 2 ? 'text-red-500 font-semibold' : 'text-slate-600 dark:text-slate-500'}`}>
                {p.label}
              </span>
              {i === 2 && <span className="text-[10px] font-mono text-red-500/70 ml-auto">waits 3rd</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-[#0f1720] border border-brand-light/30 dark:border-brand-dark/30 rounded-xl p-4">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-light dark:text-brand-dark mb-3">
          Severity order · Pulse
        </div>
        <div className="space-y-1.5">
          {priority.map((p, i) => (
            <div key={p.label} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.tone}`} />
              <span className={`text-[13px] font-mono ${i === 0 ? 'text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-600 dark:text-slate-500'}`}>
                {p.label}
              </span>
              {i === 0 && <span className="text-[10px] font-mono text-brand-light dark:text-brand-dark ml-auto">seen 1st</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Mapping row: OS concept and ER equivalent connected by a real center line + node */
function MappingRow({ m, delay }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-xl px-5 sm:px-8 py-6 hover:border-brand-light/50 dark:hover:border-brand-dark/50 transition-colors duration-300">
        <span className="absolute top-5 left-5 font-mono text-[10px] tracking-widest text-slate-600 dark:text-slate-600">
          {m.num}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-5 sm:gap-6 items-center pt-4 sm:pt-0">
          {/* OS side */}
          <div className="sm:text-right">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-500 mb-1">
              OS Concept
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">{m.os}</div>
            <p className="m-0 text-[13px] text-slate-700 dark:text-slate-400 leading-relaxed">{m.osDesc}</p>
          </div>

          {/* Connector */}
          <div className="hidden sm:flex flex-col items-center gap-1.5 px-1">
            <span className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <span className={`w-2.5 h-2.5 rounded-full ${m.dotColor}`} />
            <span className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="flex sm:hidden items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${m.dotColor}`} />
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* ER side */}
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-500 mb-1">
              ER Equivalent
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">{m.er}</div>
            <p className="m-0 text-[13px] text-slate-700 dark:text-slate-400 leading-relaxed">{m.erDesc}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className={`w-1.5 h-1.5 rounded-full ${m.dotColor}`} />
          <span className="font-mono text-[11px] text-slate-700 dark:text-slate-400">{m.algo}</span>
        </div>
      </div>
    </div>
  );
}

/* Pipeline stage on a vertical timeline rail */
function TimelineStage({ stage, delay, isLast }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`relative flex gap-4 sm:gap-5 pb-8 last:pb-0 transition-all ease-out ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: '600ms' }}
    >
      {/* rail */}
      <div className="flex flex-col items-center flex-shrink-0">
        <span className={`w-3 h-3 rounded-full ring-4 ring-white dark:ring-[#0f1720] ${stage.dotColor}`} />
        {!isLast && <span className="w-px flex-1 bg-slate-200 dark:bg-slate-700 mt-1.5" />}
      </div>

      <div className="flex-1 -mt-0.5 pb-1">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="font-mono text-[10px] text-slate-600 dark:text-slate-600">{stage.num.padStart(2, '0')}</span>
          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{stage.er}</span>
        </div>
        <span className="font-mono text-[12px] text-slate-700 dark:text-slate-400">{stage.algo}</span>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-20 sm:pt-28 pb-12 w-full">


        <FadeBlock delay={100}>
          <h1 className="m-0 font-heading font-normal text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-[4.25rem] lg:leading-[1.03] tracking-tight text-slate-900 dark:text-slate-100 mb-5 ">
            Every second has a queue.
          </h1>
        </FadeBlock>

        <FadeBlock delay={200}>
          <p className="m-0 max-w-3xl text-slate-700 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            Pulse applies operating-system scheduling — preemptive priority with aging, the Banker&apos;s Algorithm, and earliest-deadline-first — to emergency triage and ambulance dispatch. This is how a line of waiting processes became a matter of life and death.
          </p>
        </FadeBlock>
      </section>

      <EkgDivider />

      {/* The Problem */}
      <section className="max-w-6xl mx-auto px-5 py-16 sm:py-24 w-full">
        <FadeBlock>
          <div className="max-w-3xl">
            <Eyebrow>The Problem</Eyebrow>
            <p className="m-0 text-slate-800 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-5">
              Most emergency rooms sort patients by arrival time.{' '}
              <span className="font-heading italic text-slate-900 dark:text-slate-100">First-come, first-served</span>{' '}
              is simple, but it ignores urgency. A patient having a heart attack waits behind someone who stubbed a toe — because the toe arrived first.
            </p>
            <p className="m-0 text-slate-800 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
              Operating systems solved this decades ago, with algorithms that balance fairness, priority, and resource safety.{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">Pulse brings those solutions to the ER.</span>
            </p>
            <QueueCompare />
          </div>
        </FadeBlock>
      </section>

      {/* The Mapping */}
      <section className="bg-white dark:bg-[#16212c] border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-5 py-16 sm:py-24 w-full">
          <FadeBlock>
            <Eyebrow>OS Concept → ER Equivalent</Eyebrow>
            <h2 className="m-0 mb-10 sm:mb-14 text-2xl sm:text-[2rem] font-heading font-normal leading-tight text-slate-900 dark:text-slate-100 max-w-lg">
              How scheduling works in an emergency&nbsp;room
            </h2>
          </FadeBlock>

          <div className="flex flex-col gap-4">
            {MAPPINGS.map((m, i) => (
              <MappingRow key={m.num} m={m} delay={i * 90} />
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="max-w-6xl mx-auto px-5 py-16 sm:py-24 w-full">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10 lg:gap-16">
          <FadeBlock>
            <Eyebrow>Patient Pipeline</Eyebrow>
            <h2 className="m-0 mb-3 text-2xl sm:text-3xl font-heading font-normal leading-tight text-slate-900 dark:text-slate-100">
              From arrival<br />to discharge
            </h2>
            <p className="m-0 max-w-sm text-slate-700 dark:text-slate-400 text-[15px] leading-relaxed">
              Every patient flows through the same five stages. The algorithm at each stage decides who moves next, and when.
            </p>
          </FadeBlock>

          <FadeBlock delay={150}>
            <div className="bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-xl p-6 sm:p-7">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-600 dark:text-slate-500 mb-6">
                $ systemctl status patient-flow
              </div>
              {PIPELINE.map((stage, i) => (
                <TimelineStage
                  key={stage.num}
                  stage={stage}
                  delay={i * 100}
                  isLast={i === PIPELINE.length - 1}
                />
              ))}
            </div>
          </FadeBlock>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-white dark:bg-[#16212c] border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-5 py-16 sm:py-24 w-full">
          <FadeBlock>
            <Eyebrow>Built With</Eyebrow>
            <h2 className="m-0 mb-10 text-2xl sm:text-3xl font-heading font-normal leading-tight text-slate-900 dark:text-slate-100">
              The stack
            </h2>
          </FadeBlock>

          <FadeBlock delay={100}>
            <div className="bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-red-400/70" />
                <span className="w-2 h-2 rounded-full bg-amber-400/70" />
                <span className="w-2 h-2 rounded-full bg-green-400/70" />
                <span className="font-mono text-[10px] text-slate-700 dark:text-slate-500 ml-2">ps aux | pulse</span>
              </div>
              <div>
                {STACK.map((item, i) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-4 px-4 sm:px-5 py-4 ${i !== STACK.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}
                  >
                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-600 w-10 flex-shrink-0">{item.pid}</span>
                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <item.icon size={16} className="text-brand-light dark:text-brand-dark" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.label}</div>
                      <div className="text-[12px] text-slate-700 dark:text-slate-400 mt-0.5">{item.sub}</div>
                    </div>
                    <span className="hidden sm:inline font-mono text-[10px] text-green-500 flex-shrink-0">running</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeBlock>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 py-16 sm:py-24 w-full">
        <FadeBlock>
          <div className="bg-slate-100 dark:bg-[#1d2b39] border border-slate-200 dark:border-slate-700 rounded-2xl p-7 sm:p-9 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Heart size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="m-0 mb-1 text-lg font-extrabold text-slate-900 dark:text-slate-100">See it running live</h3>
                <p className="m-0 text-slate-700 dark:text-slate-400 text-[13px] max-w-md leading-relaxed">
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
        </FadeBlock>
      </section>

      <Footer />
    </div>
  );
}