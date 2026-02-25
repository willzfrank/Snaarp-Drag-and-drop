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

const METRIC_IDS = ['devices', 'users', 'emails', 'apps', 'downloads'];
const METRIC_CARDS_BY_ID = {
  devices: { title: 'Number Of Devices', value: '3,836', change: '15%', trend: 'up', sub: [{ label: 'Plugged', icon: 'bolt', value: '1,923' }, { label: 'Unplugged', icon: 'unplug', value: '1,913' }] },
  users: { title: 'Users', value: '3,836', change: '15%', trend: 'down', sub: [{ label: 'Active', icon: 'active', value: '592' }, { label: 'Offline', icon: 'offline', value: '3,836' }] },
  emails: { title: 'Emails', value: '316', change: '23%', trend: 'down', sub: [{ label: 'Sent', icon: 'sent', value: '592' }, { label: 'Received', icon: 'received', value: '3,836' }] },
  apps: { title: 'Number of Apps', value: '316', change: '23%', trend: 'down', sub: [] },
  downloads: { title: 'Number of Downloads', value: '316', change: '23%', trend: 'up', sub: [] },
};

const SMALL_IDS = ['windows', 'mac', 'linux', 'orgs', 'depts', 'groups', 'read', 'unread'];
const SMALL_CARDS_BY_ID = {
  windows: { label: 'Windows', count: '1,403 devices', icon: 'windows' },
  mac: { label: 'Mac', count: '632 devices', icon: 'mac' },
  linux: { label: 'Linux', count: '1,801 devices', icon: 'linux' },
  orgs: { label: 'Organizations', count: '1,403 users', icon: 'building' },
  depts: { label: 'Departments', count: '632 users', icon: 'dept' },
  groups: { label: 'Groups', count: '1,801 users', icon: 'groups' },
  read: { label: 'Read', count: '1,403 emails', icon: 'read' },
  unread: { label: 'Unread', count: '632 emails', icon: 'unread' },
};

function MiniMetricCard({ title, value, change, trend, sub }) {
  const isUp = trend === 'up';
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">{title}</span>
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
      {sub.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-100">
          {sub.map(({ label, icon, value }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs">
              {icon === 'bolt' && <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              {icon === 'unplug' && <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
              {icon === 'active' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
              {icon === 'offline' && <span className="w-2 h-2 rounded-full bg-red-500" />}
              {icon === 'sent' && <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>}
              {icon === 'received' && <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>}
              <span className="text-slate-600">{label}:</span>
              <span className="font-medium text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const DragHandle = () => (
  <div className="absolute top-2 right-2 opacity-40 group-hover:opacity-70 text-slate-400 pointer-events-none" aria-hidden>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
  </div>
);

function SortableMetricCard({ id }) {
  const card = METRIC_CARDS_BY_ID[id];
  if (!card) return null;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, transition: { duration: 200 } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50 shadow-lg z-10' : ''}>
      <div {...attributes} {...listeners} className="relative cursor-grab active:cursor-grabbing touch-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-xl group" tabIndex={0} role="button" aria-label={`Drag to reorder ${card.title}`}>
        <DragHandle />
        <MiniMetricCard {...card} />
      </div>
    </div>
  );
}

function SortableSmallCard({ id }) {
  const card = SMALL_CARDS_BY_ID[id];
  if (!card) return null;
  const { label, count, icon } = card;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, transition: { duration: 200 } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50 shadow-lg z-10' : ''}>
      <div {...attributes} {...listeners} className="relative cursor-grab active:cursor-grabbing touch-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg group p-3 bg-white border border-slate-200 shadow-sm flex flex-col items-center text-center gap-1" tabIndex={0} role="button" aria-label={`Drag to reorder ${label}`}>
        <DragHandle />
        {icon === 'windows' && <svg className="w-8 h-8 text-slate-600" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.5L10.5 4v7.5H3M10.5 12H3v6.5l7.5-1.5M12 4l8.5-1.5V12H12M12 20v-7.5h8.5V20L12 20z" /></svg>}
        {icon === 'mac' && <svg className="w-8 h-8 text-slate-700" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>}
        {icon === 'linux' && <svg className="w-8 h-8 text-slate-700" viewBox="0 0 24 24" fill="currentColor"><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489.123.805.489 1.564 1.052 2.119.564.555 1.27.908 2.065 1.044.795.137 1.658.057 2.447-.229.789-.286 1.513-.761 2.096-1.385.584-.624 1.027-1.387 1.285-2.206.257-.819.324-1.684.193-2.525-.131-.841-.461-1.647-.959-2.333.696-.104 1.47-.361 2.047-.896.576-.535.954-1.248 1.085-2.028.13-.78.009-1.609-.345-2.333-.354-.724-.925-1.341-1.607-1.772-.682-.431-1.465-.665-2.248-.665-.27 0-.539.023-.803.069.069-.319.104-.649.104-.982 0-1.444-.591-2.748-1.543-3.693C14.256.582 12.953 0 11.509 0h.995z" /></svg>}
        {icon === 'building' && <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        {icon === 'dept' && <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        {icon === 'groups' && <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        {icon === 'read' && <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        {icon === 'unread' && <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" /></svg>}
        <span className="text-xs font-medium text-slate-700">{label}</span>
        <span className="text-[10px] text-slate-500">{count}</span>
      </div>
    </div>
  );
}

export default function DeviceManagementWidget() {
  const [open, setOpen] = useState(true);
  const [metricOrder, setMetricOrder] = useState(METRIC_IDS);
  const [smallOrder, setSmallOrder] = useState(SMALL_IDS);

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
    if (metricOrder.includes(active.id) && metricOrder.includes(over.id)) {
      moveInList(metricOrder, setMetricOrder, active.id, over.id);
    } else if (smallOrder.includes(active.id) && smallOrder.includes(over.id)) {
      moveInList(smallOrder, setSmallOrder, active.id, over.id);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-base font-semibold text-slate-800">Device Management Dashboard</h2>
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
            <SortableContext items={metricOrder} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {metricOrder.map((id) => (
                  <SortableMetricCard key={id} id={id} />
                ))}
              </div>
            </SortableContext>
            <SortableContext items={smallOrder} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {smallOrder.map((id) => (
                  <SortableSmallCard key={id} id={id} />
                ))}
              </div>
            </SortableContext>
          </div>
        </DndContext>
      )}
    </div>
  );
}
