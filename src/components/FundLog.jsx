import { useState, useMemo } from 'react';
import {
  formatPeso, loadFundLog, saveFundLog, calculateFundBalance,
} from '../data';

const CATEGORIES = ['Health Card', 'Medical', 'Medicine', 'Other'];

function AddEntryForm({ onAdd }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    date: today,
    amount: '',
    category: 'Medical',
    description: '',
    status: 'Paid',
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) return;

    const entry = {
      id: `log-${Date.now()}`,
      date: form.date,
      amount: parseFloat(form.amount),
      category: form.category,
      description: form.description,
      status: form.status,
    };

    onAdd(entry);
    setForm({ date: today, amount: '', category: 'Medical', description: '', status: 'Paid' });
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all text-sm';
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-5 animate-fade-in" id="fund-log-form">
      <h3 className="text-sm font-bold text-primary-700 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Fund Usage Entry
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Amount (₱)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            placeholder="0"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <label className={labelClass}>Description</label>
          <input
            type="text"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Notes..."
            className={inputClass}
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className={inputClass}
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <button
            type="submit"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm hover:from-primary-600 hover:to-primary-700 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
}

export default function FundLog({ onFundUpdate }) {
  const [entries, setEntries] = useState(() => loadFundLog());
  const fundBalance = useMemo(() => calculateFundBalance(), [entries]);

  function handleAdd(entry) {
    const next = [entry, ...entries];
    setEntries(next);
    saveFundLog(next);
    if (onFundUpdate) onFundUpdate();
  }

  function handleDelete(id) {
    const next = entries.filter(e => e.id !== id);
    setEntries(next);
    saveFundLog(next);
    if (onFundUpdate) onFundUpdate();
  }

  function handleToggleStatus(id) {
    const next = entries.map(e =>
      e.id === id ? { ...e, status: e.status === 'Paid' ? 'Pending' : 'Paid' } : e
    );
    setEntries(next);
    saveFundLog(next);
  }

  // Sort entries by date descending
  const sorted = useMemo(() =>
    [...entries].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [entries]
  );

  const totalUsed = entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  return (
    <div className="space-y-5">
      {/* Running Balance Header */}
      <div className="glass-card rounded-xl p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
          <h2 className="text-sm font-bold text-primary-700 uppercase tracking-wider">Fund Summary</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-paid-light/50">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Total Contributed</p>
            <p className="text-xl font-extrabold text-paid">{formatPeso(fundBalance.totalContributed)}</p>
            <p className="text-[10px] text-text-secondary mt-0.5">All years combined</p>
          </div>
          <div className="p-4 rounded-xl bg-unpaid-light/50">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Total Used</p>
            <p className="text-xl font-extrabold text-unpaid">{formatPeso(totalUsed)}</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{entries.length} entries logged</p>
          </div>
          <div className={`p-4 rounded-xl ${fundBalance.currentBalance >= 0 ? 'bg-paid-light/50' : 'bg-unpaid-light/50'}`}>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Current Balance</p>
            <p className={`text-xl font-extrabold ${fundBalance.currentBalance >= 0 ? 'text-paid' : 'text-unpaid'}`}>
              {formatPeso(fundBalance.currentBalance)}
            </p>
            <p className="text-[10px] text-text-secondary mt-0.5">Contributed − Used</p>
          </div>
        </div>
      </div>

      {/* Add Entry Form */}
      <AddEntryForm onAdd={handleAdd} />

      {/* Log Table */}
      <div className="glass-card rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="table-container">
          <table className="w-full text-sm" id="fund-log-table">
            <thead>
              <tr className="bg-gradient-to-r from-primary-500 to-primary-600">
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-text-secondary">
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">No fund usage entries yet</p>
                      <p className="text-xs">Add an entry above to start tracking</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className={`fund-log-row border-b border-border transition-colors hover:bg-primary-50/40 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-surface-alt'
                    }`}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <td className="px-4 py-3 font-medium text-primary-700 whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge badge-info">{entry.category}</span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary max-w-[200px] truncate">
                      {entry.description || '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-unpaid whitespace-nowrap">
                      -{formatPeso(entry.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(entry.id)}
                        className={`badge cursor-pointer transition-all hover:shadow-md ${
                          entry.status === 'Paid' ? 'badge-paid' : 'badge-pending'
                        }`}
                        title="Click to toggle status"
                      >
                        {entry.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-text-secondary hover:text-unpaid transition-colors cursor-pointer p-1 rounded-lg hover:bg-unpaid-light"
                        title="Delete entry"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
