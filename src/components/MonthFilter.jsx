import { MONTHS, isMonthActive } from '../data';

export default function MonthFilter({ activeMonth, onSelect, selectedYear }) {
  return (
    <div className="glass-card rounded-xl p-4 animate-fade-in" style={{ animationDelay: '320ms' }}>
      <div className="flex items-center gap-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Filter by Month</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          id="filter-all"
          onClick={() => onSelect(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeMonth === null
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-surface-alt text-text-secondary hover:bg-primary-50 hover:text-primary-500'
          }`}
        >
          All
        </button>
        {MONTHS.map(month => {
          const active = isMonthActive(selectedYear, month);
          return (
            <button
              key={month}
              id={`filter-${month.toLowerCase()}`}
              onClick={() => onSelect(month)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMonth === month
                  ? 'bg-primary-500 text-white shadow-md'
                  : active
                    ? 'bg-surface-alt text-text-secondary hover:bg-primary-50 hover:text-primary-500'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {month.slice(0, 3)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
