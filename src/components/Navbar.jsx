import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon, Activity } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const linkClass = ({ isActive }) =>
  `text-sm font-semibold pb-1 border-b-2 transition-colors ${
    isActive
      ? 'text-slate-900 dark:text-slate-100 border-brand-light dark:border-brand-dark'
      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
  }`;

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 760) setOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#16212c] border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-5 h-[62px] flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 text-slate-900 dark:text-slate-100 no-underline">
          <span className="w-[30px] h-[30px] rounded-lg bg-teal-500/10 flex items-center justify-center">
            <Activity size={16} className="text-brand-light dark:text-brand-dark" strokeWidth={2.5} />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight">Pulse</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center cursor-pointer hover:border-brand-light dark:hover:border-brand-dark"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="md:hidden w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center cursor-pointer"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col px-5 pb-4 pt-1 border-t border-slate-200 dark:border-slate-700 gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-3 text-[15px] font-semibold border-b border-slate-200 dark:border-slate-700 ${
                  isActive ? 'text-brand-light dark:text-brand-dark' : 'text-slate-800 dark:text-slate-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
