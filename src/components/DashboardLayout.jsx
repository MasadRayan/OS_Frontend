import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BarChart3, ArrowLeft, Sun, Moon, Activity, Menu, X, Ambulance } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Patient Admit', icon: LayoutDashboard, end: true },
  { to: '/dashboard/ambulance', label: 'Ambulance', icon: Ambulance },
  { to: '/dashboard/analysis', label: 'Analysis', icon: BarChart3 },
];

function navItemClass({ isActive }) {
  return `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-teal-500/10 text-brand-light dark:text-brand-dark'
      : 'text-slate-500 dark:text-gray-700 hover:bg-slate-100 dark:hover:bg-slate-800'
  }`;
}

function mobileNavItemClass({ isActive }) {
  return `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
    isActive
      ? 'bg-teal-500/10 text-brand-light dark:text-brand-dark'
      : 'text-slate-500 dark:text-gray-700'
  }`;
}

export default function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-[#0f1720]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-56 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16212c] p-4 h-screen sticky top-0 self-start">
        <NavLink to="/" className="flex items-center gap-2 mb-8 no-underline text-slate-900 dark:text-slate-100">
          <span className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <Activity size={16} className="text-brand-light dark:text-brand-dark" strokeWidth={2.5} />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight">Pulse</span>
        </NavLink>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navItemClass}>
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <NavLink
            to="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 no-underline"
          >
            <ArrowLeft size={16} />
            Back to site
          </NavLink>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#16212c]">
          <NavLink to="/" className="flex items-center gap-1.5 no-underline text-slate-900 dark:text-slate-100">
            <Activity size={15} className="text-brand-light dark:text-brand-dark" />
            <span className="font-extrabold text-sm">Pulse</span>
          </NavLink>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
            aria-label="Open navigation menu"
          >
            <Menu size={16} />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-slate-900/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div
          className={`md:hidden fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-out bg-white dark:bg-[#16212c] border-l border-slate-200 dark:border-slate-700 shadow-xl ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <NavLink to="/" className="flex items-center gap-1.5 no-underline text-slate-900 dark:text-slate-100" onClick={() => setIsMobileMenuOpen(false)}>
              <Activity size={15} className="text-brand-light dark:text-brand-dark" />
              <span className="font-extrabold text-sm">Pulse</span>
            </NavLink>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
              aria-label="Close navigation menu"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-3">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={mobileNavItemClass} onClick={() => setIsMobileMenuOpen(false)}>
                <item.icon size={14} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-1 p-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <NavLink
              to="/"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 no-underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ArrowLeft size={16} />
              Back to site
            </NavLink>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

