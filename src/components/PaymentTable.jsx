import { useState } from 'react';
import {
  SIBLINGS, MONTHS, AMOUNT_PER_MONTH, HEALTH_CARD_COST,
  formatPeso, calculatePoolBalanceUpToMonth,
  loadHealthCardStatus, saveHealthCardStatus,
  saveFundLog, loadFundLog,
} from '../data';

function HealthCardBanner({ data, selectedYear, onFundUpdate }) {
  const [hcStatus, setHcStatus] = useState(() => loadHealthCardStatus(selectedYear));
  const [confirming, setConfirming] = useState(false);

  // Recalculate when year changes — we key by selectedYear in parent
  const juneIndex = 5; // June is index 5
  const poolBalance = calculatePoolBalanceUpToMonth(data, juneIndex);
  const isCovered = poolBalance >= HEALTH_CARD_COST;
  const shortfall = HEALTH_CARD_COST - poolBalance;

  function handleConfirmPaid() {
    setConfirming(true);
    // Log the deduction in fund log
    const entries = loadFundLog();
    entries.push({
      id: `hc-${selectedYear}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: HEALTH_CARD_COST,
      category: 'Health Card',
      description: `Parents' Health Card ${selectedYear} — Paid from Fund`,
      status: 'Paid',
    });
    saveFundLog(entries);

    // Mark health card as paid for this year
    const status = { paid: true, date: new Date().toISOString().split('T')[0] };
    saveHealthCardStatus(selectedYear, status);
    setHcStatus(status);
    setConfirming(false);

    // Notify parent to refresh fund balance
    if (onFundUpdate) onFundUpdate();
  }

  function handleUndoPaid() {
    // Remove the health card entry from fund log
    const entries = loadFundLog().filter(e =>
      !(e.category === 'Health Card' && e.description?.includes(`${selectedYear}`))
    );
    saveFundLog(entries);

    const status = { paid: false, date: null };
    saveHealthCardStatus(selectedYear, status);
    setHcStatus(status);
    if (onFundUpdate) onFundUpdate();
  }

  return (
    <tr>
      <td colSpan={SIBLINGS.length + 2} className="px-2 py-2">
        <div className="health-card-banner animate-slide-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-primary-700">
                  Parents&apos; Health Card Deduction
                </p>
                <p className="text-xs text-text-secondary">
                  Annual cost: {formatPeso(HEALTH_CARD_COST)} (₱2,500 × 9 siblings)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {hcStatus.paid ? (
                <>
                  <span className="badge badge-paid">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Paid from Fund — {hcStatus.date}
                  </span>
                  <button
                    onClick={handleUndoPaid}
                    className="text-xs text-text-secondary hover:text-unpaid transition-colors cursor-pointer underline"
                  >
                    Undo
                  </button>
                </>
              ) : isCovered ? (
                <>
                  <span className="badge badge-paid">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Covered by Fund
                  </span>
                  <button
                    id="confirm-healthcard"
                    onClick={handleConfirmPaid}
                    disabled={confirming}
                    className="btn-confirm px-4 py-1.5 rounded-lg bg-gradient-to-r from-paid to-primary-500 text-white text-xs font-bold hover:shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {confirming ? 'Processing...' : 'Confirm: Paid from Fund'}
                  </button>
                </>
              ) : (
                <span className="badge badge-unpaid">
                  Short by {formatPeso(shortfall)} — collect from siblings
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function PaymentTable({ data, filteredMonths, onToggle, selectedYear, onFundUpdate }) {
  // Calculate yearly totals per sibling
  const siblingTotals = {};
  SIBLINGS.forEach(sib => {
    siblingTotals[sib] = MONTHS.reduce((sum, m) => sum + (data[m][sib] ? AMOUNT_PER_MONTH : 0), 0);
  });
  const grandTotal = Object.values(siblingTotals).reduce((a, b) => a + b, 0);

  // Calculate row totals per month
  function monthTotal(month) {
    return SIBLINGS.reduce((sum, sib) => sum + (data[month][sib] ? AMOUNT_PER_MONTH : 0), 0);
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: '400ms' }}>
      <div className="table-container">
        <table className="w-full text-sm" id="payment-table">
          {/* Header */}
          <thead>
            <tr className="bg-gradient-to-r from-primary-500 to-primary-600">
              <th className="sticky left-0 z-10 bg-primary-500 px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                Month
              </th>
              {SIBLINGS.map(sib => (
                <th key={sib} className="px-3 py-3 text-center text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                  {sib}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                Total
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {filteredMonths.map((month, idx) => {
              const isJune = month === 'June';
              const showHealthCard = isJune;

              return (
                <>
                  <tr
                    key={month}
                    className={`border-b border-border transition-colors hover:bg-primary-50/40 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-surface-alt'
                    }`}
                  >
                    <td className={`sticky left-0 z-10 px-4 py-3 font-semibold text-primary-700 whitespace-nowrap ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-surface-alt'
                    }`}>
                      {month}
                    </td>
                    {SIBLINGS.map(sib => {
                      const paid = data[month][sib];
                      return (
                        <td key={sib} className="px-3 py-2.5 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <input
                              type="checkbox"
                              id={`check-${month}-${sib}`}
                              checked={paid}
                              onChange={() => onToggle(month, sib)}
                              className={`w-4.5 h-4.5 rounded cursor-pointer transition-all ${paid ? 'checkbox-paid' : 'checkbox-unpaid'}`}
                            />
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide leading-none ${
                                paid
                                  ? 'bg-paid-light text-paid'
                                  : 'bg-unpaid-light text-unpaid'
                              }`}
                            >
                              {paid ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center font-bold text-primary-700 whitespace-nowrap">
                      {formatPeso(monthTotal(month))}
                    </td>
                  </tr>

                  {/* Health Card Deduction Banner — after June row */}
                  {showHealthCard && (
                    <HealthCardBanner
                      key={`hc-${selectedYear}`}
                      data={data}
                      selectedYear={selectedYear}
                      onFundUpdate={onFundUpdate}
                    />
                  )}
                </>
              );
            })}
          </tbody>

          {/* Yearly Totals Footer */}
          <tfoot>
            <tr className="bg-gradient-to-r from-primary-700 to-primary-800">
              <td className="sticky left-0 z-10 bg-primary-700 px-4 py-3 font-bold text-white text-xs uppercase tracking-wider">
                Yearly Total
              </td>
              {SIBLINGS.map(sib => (
                <td key={sib} className="px-3 py-3 text-center font-bold text-white text-sm whitespace-nowrap">
                  {formatPeso(siblingTotals[sib])}
                </td>
              ))}
              <td className="px-4 py-3 text-center font-extrabold text-white text-base whitespace-nowrap">
                {formatPeso(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
