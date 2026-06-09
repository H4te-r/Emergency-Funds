import { useState, useCallback, useEffect } from 'react';
import {
  MONTHS, loadData, saveData, calculateStats, calculateAllYearsStats,
  migrateOldData,
} from './data';
import LockScreen from './components/LockScreen';
import SummaryCards from './components/SummaryCards';
import MonthFilter from './components/MonthFilter';
import PaymentTable from './components/PaymentTable';
import YearSelector from './components/YearSelector';
import FundLog from './components/FundLog';

// Run data migration once on app load
migrateOldData();

export default function App() {
  const [locked, setLocked] = useState(true);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [data, setData] = useState(() => loadData(selectedYear));
  const [activeMonth, setActiveMonth] = useState(null);
  const [activeTab, setActiveTab] = useState('tracker');
  const [showAllYears, setShowAllYears] = useState(false);
  const [fundVersion, setFundVersion] = useState(0); // bump to force re-render of fund balance

  // Reload data when year changes
  useEffect(() => {
    setData(loadData(selectedYear));
  }, [selectedYear]);

  const handleUnlock = useCallback(() => setLocked(false), []);
  const handleLock = useCallback(() => setLocked(true), []);

  const handleToggle = useCallback((month, sibling) => {
    setData(prev => {
      const next = { ...prev, [month]: { ...prev[month], [sibling]: !prev[month][sibling] } };
      saveData(selectedYear, next);
      return next;
    });
    // Bump fund version so balance recalculates
    setFundVersion(v => v + 1);
  }, [selectedYear]);

  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
    setActiveMonth(null);
  }, []);

  const handleFundUpdate = useCallback(() => {
    setFundVersion(v => v + 1);
  }, []);

  // Lock screen
  if (locked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  const stats = showAllYears ? calculateAllYearsStats() : calculateStats(data);
  const filteredMonths = activeMonth ? [activeMonth] : MONTHS;

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
                Family Emergency Fund
              </h1>
              <p className="text-xs text-primary-100 hidden sm:block">
                Monthly contribution tracker — ₱500/month per sibling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Year Selector */}
            <YearSelector selectedYear={selectedYear} onYearChange={handleYearChange} />

            {/* Lock Button */}
            <button
              id="lock-button"
              onClick={handleLock}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
              title="Lock and return to password screen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 space-y-5">
        {/* Summary Cards — key by fundVersion to force balance recalc */}
        <SummaryCards
          key={`summary-${fundVersion}`}
          stats={stats}
          showAllYears={showAllYears}
          onToggleAllYears={() => setShowAllYears(prev => !prev)}
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-2">
          <button
            id="tab-tracker"
            onClick={() => setActiveTab('tracker')}
            className={`tab-button ${activeTab === 'tracker' ? 'tab-active' : 'tab-inactive'}`}
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Payment Tracker
            </span>
          </button>
          <button
            id="tab-fundlog"
            onClick={() => setActiveTab('fundlog')}
            className={`tab-button ${activeTab === 'fundlog' ? 'tab-active' : 'tab-inactive'}`}
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              Fund Log
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'tracker' ? (
          <>
            <MonthFilter activeMonth={activeMonth} onSelect={setActiveMonth} />
            <PaymentTable
              data={data}
              filteredMonths={filteredMonths}
              onToggle={handleToggle}
              selectedYear={selectedYear}
              onFundUpdate={handleFundUpdate}
            />
          </>
        ) : (
          <FundLog onFundUpdate={handleFundUpdate} />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 text-center">
        <p className="text-xs text-text-secondary">
          Family Emergency Fund Tracker &copy; {new Date().getFullYear()} &middot; Data stored locally in your browser
        </p>
      </footer>
    </div>
  );
}
