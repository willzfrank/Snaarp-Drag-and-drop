import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const KPI_IDS = ['hours', 'days', 'users', 'web'];
const KPI_CARDS_BY_ID = {
  hours: { title: 'Hours Productivity', value: '576 Hrs', change: '15%', trend: 'down', icon: 'clock' },
  days: { title: 'Days Activity', value: '267 Days', change: '15%', trend: 'up', icon: 'calendar' },
  users: { title: 'Users', value: '3,836', change: '15%', trend: 'down', icon: 'user' },
  web: { title: 'Web Activity', value: '178 Activities', change: '15%', trend: 'up', icon: 'globe' },
};

const CHART_IDS = ['email-chart', 'total-email'];

const EMAIL_DONUT = [
  { label: 'Sent', color: 'text-orange-500', pct: 45 },
  { label: 'Received', color: 'text-blue-500', pct: 50 },
  { label: 'Unsent', color: 'text-slate-300', pct: 5 },
];

const LINE_MONTHS = ['JAN', 'FEB', 'MARCH', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const LINE_VALUES = [1200, 1800, 2200, 1900, 2800, 3500, 4200, 3800, 4500, 5200, 5800, 6200];

function KpiCard({ title, value, change, trend, icon }) {
  const isUp = trend === 'up';
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        {icon === 'clock' && <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        {icon === 'calendar' && <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        {icon === 'user' && <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
        {icon === 'globe' && <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <span className="text-xl font-bold text-slate-900">{value}</span>
          <span className={`ml-1.5 text-xs flex items-center gap-0.5 ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
            {isUp ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            )}
            {change}
          </span>
        </div>
        <div className={`w-12 h-8 flex-shrink-0 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
          <svg viewBox="0 0 64 40" className="w-full h-full" preserveAspectRatio="none">
            <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={isUp ? "0,30 15,25 30,28 45,15 64,20" : "0,10 15,18 30,12 45,22 64,8"} />
          </svg>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-0.5">Compared to last week</p>
    </div>
  );
}

const DragHandle = () => (
  <div className="absolute top-2 right-2 opacity-40 group-hover:opacity-70 text-slate-400 pointer-events-none" aria-hidden>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
  </div>
);

function SortableKpiCard({ id }) {
  const card = KPI_CARDS_BY_ID[id];
  if (!card) return null;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, transition: { duration: 200 } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50 shadow-lg z-10' : ''}>
      <div {...attributes} {...listeners} className="relative cursor-grab active:cursor-grabbing touch-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-xl group" tabIndex={0} role="button" aria-label={`Drag to reorder ${card.title}`}>
        <DragHandle />
        <KpiCard {...card} />
      </div>
    </div>
  );
}

function EmailChartCardContent() {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        <span className="text-sm font-medium text-slate-600">Email Chart</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="2 2" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="45 55" strokeLinecap="round" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="50 50" strokeDashoffset="-45" strokeLinecap="round" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="5 95" strokeDashoffset="-95" strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-600">Emails Chart</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-3">
          {EMAIL_DONUT.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs">
              <span className={`w-3 h-3 rounded-sm ${color === 'text-orange-500' ? 'bg-orange-500' : color === 'text-blue-500' ? 'bg-blue-500' : 'bg-slate-300'}`} />
              <span className="text-slate-600">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm font-bold text-slate-800 mt-2">TOTAL EMAILS SENT 5,421</p>
      </div>
    </>
  );
}

function TotalEmailCardContent() {
  const maxLine = Math.max(...LINE_VALUES);
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <span className="text-sm font-medium text-slate-600">Total Email</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-400" aria-label="Bar chart"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></button>
          <button type="button" className="p-1.5 rounded bg-[#edf3ff] text-[#5970ff]" aria-label="Line chart"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg></button>
          <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Period"><option>Month</option></select>
        </div>
      </div>
      <div className="flex gap-0.5 items-end" style={{ height: 120 }}>
        <div className="flex flex-col justify-between text-[10px] text-slate-500 pr-1 h-full">
          {[7000, 5000, 3000, 1000, 0].map((n) => (
            <span key={n}>{n.toLocaleString()}</span>
          ))}
        </div>
        <div className="flex-1 min-w-0 h-full flex flex-col justify-end pb-5">
          <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
            <polyline fill="none" stroke="#47a2fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={LINE_VALUES.map((v, i) => `${(i / (LINE_VALUES.length - 1)) * 200},${80 - (v / maxLine) * 70}`).join(' ')} />
          </svg>
          <div className="flex justify-between gap-0.5 mt-0.5">
            {LINE_MONTHS.map((m) => (
              <span key={m} className="text-[9px] text-slate-500 truncate flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SortableChartCard({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, transition: { duration: 200 } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50 shadow-lg z-10' : ''}>
      <div {...attributes} {...listeners} className="relative cursor-grab active:cursor-grabbing touch-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-xl group p-5 bg-white border border-slate-200 shadow-sm" tabIndex={0} role="button" aria-label={`Drag to reorder ${id === 'email-chart' ? 'Email Chart' : 'Total Email'}`}>
        <DragHandle />
        {id === 'email-chart' ? <EmailChartCardContent /> : <TotalEmailCardContent />}
      </div>
    </div>
  );
}

export default function ProductivityReportWidget() {
  const [open, setOpen] = useState(true);
  const [kpiOrder, setKpiOrder] = useState(KPI_IDS);
  const [chartOrder, setChartOrder] = useState(CHART_IDS);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const moveInList = (list, setList, activeId, overId) => {
    const activeIndex = list.indexOf(activeId);
    const overIndex = list.indexOf(overId);
    if (activeIndex === -1 || overIndex === -1 || activeId === overId) return;
    const next = [...list];
    const [removed] = next.splice(activeIndex, 1);
    next.splice(overIndex, 0, removed);
    setList(next);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (kpiOrder.includes(active.id) && kpiOrder.includes(over.id)) {
      moveInList(kpiOrder, setKpiOrder, active.id, over.id);
    } else if (chartOrder.includes(active.id) && chartOrder.includes(over.id)) {
      moveInList(chartOrder, setChartOrder, active.id, over.id);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H5a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h2 className="text-base font-semibold text-slate-800">Productivity Report</h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#47a2fe] text-white text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Upgrade Plan
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="p-2 rounded-lg hover:bg-[#edf3ff] hover:text-[#5970ff] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform"
            aria-expanded={open}
            aria-label={open ? 'Collapse section' : 'Expand section'}
          >
            <svg className={`w-5 h-5 text-slate-500 transition-transform ${open ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="p-5 space-y-5 bg-slate-50/50">
            <SortableContext items={kpiOrder} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {kpiOrder.map((id) => (
                  <SortableKpiCard key={id} id={id} />
                ))}
              </div>
            </SortableContext>
            <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {chartOrder.map((id) => (
                  <SortableChartCard key={id} id={id} />
                ))}
              </div>
            </SortableContext>
          </div>
        </DndContext>
      )}
    </div>
  );
}
