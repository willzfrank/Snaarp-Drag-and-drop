export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
      <label htmlFor="search" className="sr-only">
        Search for users, groups or settings
      </label>
      <div className="relative flex-1 max-w-xl">
        <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          id="search"
          type="search"
          placeholder="Search for users, groups or settings"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search for users, groups or settings"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded-lg bg-[#f6f6f6] hover:bg-[#edf3ff] hover:text-[#5970ff] focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="flex items-center gap-2 rounded px-2 py-1.5 bg-[#f6f6f6] text-xs font-mono">
          <span className="text-[#575757]">Agent Code:</span>
          <span className="text-[#47a2fe]">0365o2j37742y3b38</span>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText('0365o2j37742y3b38')}
            className="p-0.5 rounded hover:bg-[#edf3ff] hover:text-[#5970ff] focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Copy agent code"
          >
            <svg className="w-4 h-4 text-[#575757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
