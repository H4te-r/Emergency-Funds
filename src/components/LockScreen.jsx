import { useState } from 'react';
import { DEFAULT_PASSWORD } from '../data';

export default function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (password === DEFAULT_PASSWORD) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div className="lock-bg min-h-screen flex items-center justify-center p-4">
      {/* Decorative circles */}
      <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-white/5 blur-xl" />
      <div className="absolute bottom-[-120px] right-[-60px] w-[400px] h-[400px] rounded-full bg-white/5 blur-xl" />

      <div className={`glass-card rounded-2xl p-8 sm:p-10 w-full max-w-sm animate-fade-in relative z-10 ${shaking ? 'animate-shake' : ''}`}>
        {/* Logo / Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg animate-pulse-glow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-bold text-center text-primary-700 mb-1">
          Family Emergency Fund
        </h1>
        <p className="text-sm text-center text-text-secondary mb-8">
          Enter password to continue
        </p>

        <form onSubmit={handleSubmit} id="login-form">
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all text-sm"
              autoFocus
            />
          </div>

          {error && (
            <div id="error-message" className="flex items-center gap-2 text-unpaid text-sm mb-4 animate-slide-down bg-unpaid-light px-3 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Incorrect password. Please try again.
            </div>
          )}

          <button
            id="unlock-button"
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
