import { NavLink } from 'react-router-dom';
import { ShieldCheck, Clock, MapPinned, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

const FEATURES = [
  {
    icon: Clock,
    title: 'Priority scheduling, with aging',
    body:
      'The waiting list is always sorted by real urgency, not arrival order. A critical patient jumps the queue instantly, and anyone who waits long enough gets their priority boosted automatically — so no one is left behind indefinitely.',
  },
  {
    icon: ShieldCheck,
    title: "Banker's Algorithm admission",
    body:
      'Before any patient is admitted, the system checks whether beds, doctors, ICU slots, and ventilators can safely cover everyone already admitted. If not, the admission is refused rather than risking a resource deadlock.',
  },
  {
    icon: MapPinned,
    title: 'Priority-first ambulance dispatch',
    body:
      'Every incoming call is matched by urgency first, then by the nearest available ambulance using real geographic distance — so the most critical call is never left waiting behind a closer, less severe one.',
  },
];

function EkgDivider() {
  return (
    <div className="border-y border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16212c] overflow-hidden">
      <svg viewBox="0 0 1200 90" width="100%" height="90" preserveAspectRatio="none">
        <polyline
          points="0,45 220,45 250,45 268,10 286,80 304,45 340,45 420,45 448,45 466,20 484,70 502,45 540,45 1200,45"
          fill="none"
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth="1.5"
        />
        <polyline
          points="0,45 220,45 250,45 268,10 286,80 304,45 340,45 420,45 448,45 466,20 484,70 502,45 540,45 1200,45"
          fill="none"
          className="stroke-brand-light dark:stroke-brand-dark animate-ekg-sweep [stroke-dasharray:18_400]"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="100"
        />
      </svg>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-16 pb-10 flex flex-col gap-5">
        <div className="font-mono text-[11.5px] tracking-widest uppercase text-brand-light dark:text-brand-dark">
          OS Lab Project — Scheduling &amp; Resource Allocation
        </div>
        <h1 className="m-0 font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-slate-100 text-4xl sm:text-5xl lg:text-6xl max-w-3xl">
          Emergency care shouldn&apos;t wait on a queue.
        </h1>
        <p className="m-0 max-w-xl text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
          Pulse applies real operating-system scheduling algorithms — preemptive
          priority scheduling with aging, the Banker&apos;s Algorithm, and
          priority-first resource matching — to a problem that actually matters:
          who gets treated next, who gets a bed, and which ambulance gets sent
          where.
        </p>

        <div className="flex gap-3 mt-2 flex-wrap">
          <NavLink
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-brand-light dark:bg-brand-dark text-white dark:text-[#04201d] no-underline font-bold text-sm px-[18px] py-3 rounded-lg"
          >
            Open dashboard <ArrowRight size={16} />
          </NavLink>
          <NavLink
            to="/about"
            className="inline-flex items-center text-slate-900 dark:text-slate-100 no-underline font-bold text-sm px-[18px] py-3 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            About the project
          </NavLink>
        </div>
      </section>

      <EkgDivider />

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <h2 className="text-[13px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
          Three algorithms, one emergency room
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white dark:bg-[#16212c] border border-slate-200 dark:border-slate-700 rounded-xl p-[22px]">
              <div className="w-[38px] h-[38px] rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                <f.icon size={18} className="text-brand-light dark:text-brand-dark" strokeWidth={2.2} />
              </div>
              <h3 className="m-0 mb-2 text-base font-bold text-slate-900 dark:text-slate-100">{f.title}</h3>
              <p className="m-0 text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="bg-slate-100 dark:bg-[#1d2b39] border border-slate-200 dark:border-slate-700 rounded-2xl p-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="m-0 mb-1.5 text-lg font-extrabold text-slate-900 dark:text-slate-100">See it running live</h3>
            <p className="m-0 text-slate-500 dark:text-slate-400 text-[13.5px]">
              Admit patients, watch the queue re-sort in real time, and dispatch ambulances on the map.
            </p>
          </div>
          <NavLink
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-brand-light dark:bg-brand-dark text-white dark:text-[#04201d] no-underline font-bold text-sm px-4 py-2.5 rounded-lg whitespace-nowrap"
          >
            Open dashboard <ArrowRight size={16} />
          </NavLink>
        </div>
      </section>

      <Footer />
    </div>
  );
}
