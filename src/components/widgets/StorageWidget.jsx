const SEGMENTS = [
  { label: 'Files', color: 'bg-red-400' },
  { label: 'Folders', color: 'bg-amber-400' },
  { label: 'Videos', color: 'bg-emerald-400' },
  { label: 'Apps', color: 'bg-blue-400' },
  { label: 'Audios', color: 'bg-violet-400' },
  { label: 'Miscellaneous', color: 'bg-orange-400' },
];

export default function StorageWidget() {
  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-slate-600">Storage</span>
      </div>
      <div className="flex gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="2 2" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#storageGrad)" strokeWidth="3" strokeDasharray="80 100" strokeLinecap="round" />
            <defs>
              <linearGradient id="storageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="25%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="75%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-800">80% Used</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 flex gap-2 mb-3">
            <span className="text-amber-600 flex-shrink-0" aria-hidden>⚠</span>
            <p className="text-xs text-amber-800">
              You&apos;ve almost reached your limit. You have used 80% of your available storage. Upgrade plan to access more space.
            </p>
          </div>
          <ul className="space-y-1.5 mb-4">
            {SEGMENTS.map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-xs">
                <span className={`w-3 h-3 rounded-sm ${s.color}`} aria-hidden />
                <span className="text-slate-600">{s.label}</span>
              </li>
            ))}
            <li className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-sm bg-slate-200 border border-dashed border-slate-300" aria-hidden />
              <span className="text-slate-600">Available Space</span>
            </li>
          </ul>
          <button type="button" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}
