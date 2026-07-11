import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 mt-14">
      <div className="max-w-6xl mx-auto px-5 py-7 flex flex-wrap gap-4 items-center justify-between">
        <span className="text-[13px] text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Pulse — Emergency Triage &amp; Dispatch. Built for OS Lab.
        </span>
        <div className="flex gap-5">
          {[
            { to: '/about', label: 'About' },
            { to: '/contact', label: 'Contact' },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 no-underline"
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
