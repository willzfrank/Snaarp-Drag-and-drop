const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const STACK = [
  { label: 'Public', color: 'bg-blue-300' },
  { label: 'Anyone with link', color: 'bg-blue-400' },
  { label: 'Within Organisation', color: 'bg-blue-600' },
];

export default function FileSharingWidget() {
  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <div className="text-sm font-medium text-slate-600">File Sharing</div>
        <p className="text-xs text-slate-500 mt-0.5">Keep track of files and how they&apos;re shared</p>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex rounded-lg border border-slate-200 p-0.5">
          <button type="button" className="p-1.5 rounded bg-blue-100 text-blue-600" aria-pressed="true" title="Bar chart">▤</button>
          <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" aria-pressed="false" title="Line chart">▤</button>
          <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" aria-pressed="false" title="Table">▦</button>
        </div>
        <select className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Select period">
          <option>Month</option>
        </select>
      </div>
      <div className="h-40 flex items-end gap-1">
        {MONTHS.map((m, i) => (
          <div key={m} className="flex-1 flex flex-col justify-end gap-0.5 group">
            <div className="flex flex-col-reverse h-32 gap-0.5">
              <div className="flex-1 min-h-[4px] bg-blue-300 rounded-t" style={{ height: `${25 + (i % 3) * 15}%` }} />
              <div className="flex-1 min-h-[4px] bg-blue-400 rounded-t" style={{ height: `${30 + (i % 4) * 10}%` }} />
              <div className="flex-1 min-h-[4px] bg-blue-600 rounded-t" style={{ height: `${20 + (i % 5) * 12}%` }} />
            </div>
            <span className="text-[10px] text-slate-500 text-center mt-1">{m}</span>
          </div>
        ))}
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
