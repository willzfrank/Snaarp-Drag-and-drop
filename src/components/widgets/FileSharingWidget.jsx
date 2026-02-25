const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// Sample data: [Public, Anyone with link, Within Organisation] per month (0-100 scale)
const BAR_DATA = [
  [40, 35, 25], [55, 30, 15], [30, 45, 25], [50, 25, 25], [45, 40, 15], [80, 10, 10],
  [35, 50, 15], [60, 20, 20], [40, 35, 25], [55, 30, 15], [45, 40, 15], [50, 30, 20],
];

const STACK = [
  { label: 'Public', color: 'bg-blue-300' },
  { label: 'Anyone with link', color: 'bg-blue-400' },
  { label: 'Within Organisation', color: 'bg-blue-600' },
];

export default function FileSharingWidget() {
  const maxVal = 100;
  const chartHeight = 140;

  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-3">
        <div className="text-sm font-medium text-slate-600">File Sharing</div>
        <p className="text-xs text-slate-500 mt-0.5">Keep track of files and how they&apos;re shared</p>
      </div>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex rounded-lg border border-slate-200 p-0.5">
          <button type="button" className="p-1.5 rounded bg-[#edf3ff] text-[#5970ff]" aria-pressed="true" title="Bar chart">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" aria-pressed="false" title="Line chart">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" aria-pressed="false" title="Table">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          </button>
        </div>
        <select className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Select period">
          <option>Month</option>
        </select>
      </div>
      <div className="flex gap-0.5 items-end" style={{ height: chartHeight + 24 }}>
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-full py-0 text-[10px] text-slate-500 pr-1" style={{ height: chartHeight }}>
          {[100, 50, 0].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        {/* Bars */}
        <div className="flex-1 flex gap-0.5 min-w-0" style={{ height: chartHeight }}>
          {MONTHS.map((m, i) => {
            const [a, b, c] = BAR_DATA[i];
            return (
              <div key={m} className="flex-1 flex flex-col justify-end gap-0.5 group">
                <div className="flex gap-0.5" style={{ height: '100%' }}>
                  <div
                    className="flex-1 min-w-0 rounded-t bg-blue-300 transition-opacity group-hover:opacity-90"
                    style={{ height: `${(a / maxVal) * 100}%` }}
                    title={`${m} Public: ${a}`}
                  />
                  <div
                    className="flex-1 min-w-0 rounded-t bg-blue-400 transition-opacity group-hover:opacity-90"
                    style={{ height: `${(b / maxVal) * 100}%` }}
                    title={`${m} Anyone with link: ${b}`}
                  />
                  <div
                    className="flex-1 min-w-0 rounded-t bg-blue-600 transition-opacity group-hover:opacity-90"
                    style={{ height: `${(c / maxVal) * 100}%` }}
                    title={`${m} Within Organisation: ${c}`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 text-center mt-1 truncate">{m}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-3">
        {STACK.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs">
            <span className={`w-3 h-3 rounded-sm ${s.color}`} aria-hidden />
            <span className="text-slate-600">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
