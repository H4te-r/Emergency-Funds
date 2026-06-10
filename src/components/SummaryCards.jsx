import { formatPeso, calculateFundBalance } from '../data';

const CARD_CONFIG = [
  {
    key: 'collected',
    label: 'Total Collected',
    getValue: (s) => formatPeso(s.totalCollected),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    colorClass: 'text-paid bg-paid-light',
    iconBg: 'bg-paid/10',
  },
  {
    key: 'expected',
    label: 'Expected Total',
    getValue: (s) => formatPeso(s.totalExpected),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    colorClass: 'text-primary-500 bg-primary-50',
    iconBg: 'bg-primary-500/10',
  },
  {
    key: 'balance',
    label: 'Remaining',
    getValue: (s) => formatPeso(s.balance),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    colorClass: 'text-amber-600 bg-amber-50',
    iconBg: 'bg-amber-500/10',
  },
  {
    key: 'unpaid',
    label: 'Unpaid Count',
    getValue: (s) => s.unpaidCount,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    colorClass: 'text-unpaid bg-unpaid-light',
    iconBg: 'bg-unpaid/10',
  },
];

export default function SummaryCards({ stats, selectedYear, showAllYears, onToggleAllYears }) {
  const fundBalance = calculateFundBalance();

  return (
    <div className="space-y-4">
      {/* All-Years Toggle */}
      <div className="flex items-center justify-end">
        <button
          id="toggle-all-years"
          onClick={onToggleAllYears}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            showAllYears
              ? 'bg-primary-500 text-white shadow-md'
              : 'glass-card text-text-secondary hover:text-primary-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {showAllYears ? 'Showing All Years' : 'Show All Years'}
        </button>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {CARD_CONFIG.map((card, i) => (
          <div
            key={card.key}
            id={`stat-card-${card.key}`}
            className="glass-card rounded-xl p-5 animate-fade-in hover:shadow-lg transition-shadow"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {card.label}
              </span>
              <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center ${card.colorClass.split(' ')[0]}`}>
                {card.icon}
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold ${card.colorClass.split(' ')[0]}`}>
              {card.getValue(stats)}
            </div>
          </div>
        ))}

        {/* Fund Balance Card — always shows all-time balance */}
        <div
          id="stat-card-fund-balance"
          className="glass-card rounded-xl p-5 animate-fade-in hover:shadow-lg transition-shadow col-span-2 lg:col-span-1"
          style={{ animationDelay: '320ms' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Fund Balance
            </span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              fundBalance.currentBalance >= 0 ? 'bg-paid/10 text-paid' : 'bg-unpaid/10 text-unpaid'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold ${
            fundBalance.currentBalance >= 0 ? 'text-paid' : 'text-unpaid'
          }`}>
            {formatPeso(fundBalance.currentBalance)}
          </div>
          <div className="mt-2 flex flex-col gap-0.5">
            <span className="text-[10px] text-text-secondary">
              In: {formatPeso(fundBalance.totalContributed)} &nbsp;·&nbsp; Out: {formatPeso(fundBalance.totalUsed)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
