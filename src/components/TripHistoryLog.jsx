import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../api/client';
import { SEV_BADGE, SEVERITY_LABELS } from '../lib/severity';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_LABEL = {
  arrived: 'Arrived',
  cancelled: 'Cancelled',
  en_route: 'En route',
  on_scene: 'On scene',
  transporting: 'Transporting',
};

export default function TripHistoryLog() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 20 });

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await endpoints.getTripHistory(filters);
      setData(res.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="relative flex-1 max-w-[200px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2.5 py-1.5 text-[12px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-light/40"
            placeholder="Search caller…"
            value={filters.callerName || ''}
            onChange={(e) => setFilters((f) => ({ ...f, callerName: e.target.value || undefined, page: 1 }))}
          />
        </div>
        <select
          className="bg-slate-50 dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-[12px] text-slate-900 dark:text-slate-100 focus:outline-none"
          value={filters.status || ''}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined, page: 1 }))}
        >
          <option value="">All outcomes</option>
          <option value="arrived">Arrived</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-80 scrollbar-thin">
        <table className="w-full text-[11.5px] border-collapse">
          <thead>
            <tr className="text-left text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
              <th className="py-1.5 pr-2 font-medium">Caller</th>
              <th className="py-1.5 pr-2 font-medium">Sev.</th>
              <th className="py-1.5 pr-2 font-medium">Unit</th>
              <th className="py-1.5 pr-2 font-medium">Status</th>
              <th className="py-1.5 pr-2 font-medium">Response</th>
              <th className="py-1.5 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {(!data || data.trips.length === 0) && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400 dark:text-slate-500">
                  {loading ? 'Loading…' : 'No trips found.'}
                </td>
              </tr>
            )}
            {data?.trips.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-1.5 pr-2 text-slate-800 dark:text-slate-200">{t.callerName}</td>
                <td className="py-1.5 pr-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${SEV_BADGE[t.severity]}`}>
                    {SEVERITY_LABELS[t.severity]}
                  </span>
                </td>
                <td className="py-1.5 pr-2 text-slate-500 dark:text-slate-400">{t.ambulanceName}</td>
                <td className="py-1.5 pr-2">
                  <span className={`text-[10px] font-semibold ${t.status === 'arrived' ? 'text-green-500' : t.status === 'cancelled' ? 'text-red-500' : 'text-orange-500'}`}>
                    {STATUS_LABEL[t.status] || t.status}
                  </span>
                </td>
                <td className="py-1.5 pr-2 font-mono text-slate-500 dark:text-slate-400">
                  {t.responseTimeMin?.toFixed(1)}m
                </td>
                <td className="py-1.5 font-mono text-slate-400 dark:text-slate-500">
                  {new Date(t.dispatchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.total > data.limit && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {data.total} total
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              disabled={filters.page <= 1}
              className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 px-1">
              {filters.page} / {totalPages}
            </span>
            <button
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              disabled={filters.page >= totalPages}
              className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
