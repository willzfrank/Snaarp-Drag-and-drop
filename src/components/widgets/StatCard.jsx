export default function StatCard({ title, value, change, trend, icon }) {
  const isPositive = trend === 'up';
  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        {icon ?? (
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <span className="text-2xl font-bold text-slate-900">{value}</span>
          <span className={`ml-2 text-sm flex items-center gap-0.5 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPositive ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            )}
            {change}
          </span>
        </div>
        <div className={`w-16 h-10 flex-shrink-0 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
          <svg viewBox="0 0 64 40" className="w-full h-full" preserveAspectRatio="none">
            <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={isPositive ? "0,30 15,25 30,28 45,15 64,20" : "0,10 15,18 30,12 45,22 64,8"} />
          </svg>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-1">Compared to last week</p>
    </div>
  );
}
