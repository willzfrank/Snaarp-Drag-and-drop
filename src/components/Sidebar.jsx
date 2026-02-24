export default function Sidebar() {
  const navItems = [
    { label: 'Dashboard', active: true },
    { label: 'Organization & Reg.' },
    { label: 'Reporting' },
    { label: 'Billing' },
    { label: 'Account' },
    { label: 'Storage' },
    { label: 'Settings' },
    { label: 'Device Management' },
    { label: 'Productivity Report' },
    { label: 'User Panel' },
    { label: 'Support' },
  ];

  return (
    <aside className="w-56 h-full flex flex-col shrink-0 rounded-[4px] bg-white text-white overflow-hidden">
      <div className="flex shrink-0 items-center px-5 py-4">
        <span className="font-bold text-xl text-[#141414]">Snaarp</span>
      </div>
      <nav className="flex-1 min-h-0 overflow-y-auto px-3" aria-label="Main navigation">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0f172a] ${item.active
                    ? 'bg-blue-500/20 text-black'
                    : 'text-[#a4a4a4] hover:bg-[#edf3ff] hover:text-[#5970ff]'
                  }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto flex shrink-0 items-center gap-3 border-t-[0.5px] border-[#f9f9f9] px-4 py-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-[#475569] flex items-center justify-center text-sm font-medium">
          CS
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm text-[#4d4d4d] font-medium">Chidinma Snaarp</div>
          <div className="truncate text-xs text-[#d9d5d5]">aim.lawso@example.com</div>
        </div>
      </div>
    </aside>
  );
}
