export default function YearSelector({ selectedYear, onYearChange }) {
  return (
    <div className="flex items-center gap-2">
      <button
        id="year-prev"
        onClick={() => onYearChange(selectedYear - 1)}
        className="year-nav-btn"
        title="Previous year"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <span className="text-white font-bold text-lg tabular-nums min-w-[4rem] text-center select-none">
        {selectedYear}
      </span>

      <button
        id="year-next"
        onClick={() => onYearChange(selectedYear + 1)}
        className="year-nav-btn"
        title="Next year"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
