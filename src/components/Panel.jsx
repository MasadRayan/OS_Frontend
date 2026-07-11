export default function Panel({ title, eyebrow, right, children, className = '' }) {
  return (
    <section
      className={`bg-white dark:bg-[#16212c] border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 dark:border-slate-700">
        <div>
          {eyebrow && (
            <div className="font-mono text-[10.5px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
              {eyebrow}
            </div>
          )}
          <h2 className="m-0 text-[15px] font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        </div>
        {right}
      </div>
      <div className="p-4 flex-1 overflow-auto scrollbar-thin">{children}</div>
    </section>
  );
}
