const LOCATIONS = [
  { country: 'United Kingdom', pct: 78, flag: '🇬🇧' },
  { country: 'Nigeria', pct: 61, flag: '🇳🇬' },
  { country: 'UAE', pct: 45, flag: '🇦🇪' },
  { country: 'Canada', pct: 59, flag: '🇨🇦' },
  { country: 'United States of America', pct: 78, flag: '🇺🇸' },
];

export default function ActiveUsersWidget() {
  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-600">Active Users</span>
        <select className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Select month">
          <option>Month</option>
        </select>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 min-w-0 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center h-48 text-slate-400 text-sm">
          Map (Stanley, Chisom, Samuel)
        </div>
        <div className="w-44 space-y-3">
          {LOCATIONS.map((loc) => (
            <div key={loc.country}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="flex items-center gap-1.5 truncate">
                  <span aria-hidden>{loc.flag}</span>
                  <span className="text-slate-700 truncate">{loc.country}</span>
                </span>
                <span className="text-slate-600 font-medium">{loc.pct}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${loc.pct}%` }}
                  role="progressbar"
                  aria-valuenow={loc.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${loc.country}: ${loc.pct}%`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
