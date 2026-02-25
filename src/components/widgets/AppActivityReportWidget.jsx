import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const INITIAL_APPS = [
  { id: '1', name: 'Google Chrome', users: 34, hours: '3 hours 12 minutes', date: '2024-06-26 15:33:49' },
  { id: '2', name: 'YouTube', users: 12, hours: '2 hours 8 minutes', date: '2024-05-26 12:45:41' },
  { id: '3', name: 'Microsoft Teams', users: 16, hours: '6 hours 45 minutes', date: '2024-05-21 16:28:21' },
  { id: '4', name: 'WhatsApp', users: 49, hours: '1 hour 30 minutes', date: '2024-06-26 15:33:49' },
  { id: '5', name: 'Opera Mini', users: 3, hours: '9 hours 10 minutes', date: '2024-05-21 16:28:21' },
  { id: '6', name: 'Instagram', users: 22, hours: '45 minutes', date: '2024-05-26 12:45:41' },
];

function SortableAppRow({ app }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: app.id, transition: { duration: 200 } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <tr ref={setNodeRef} style={style} className={`border-b border-slate-100 last:border-0 ${isDragging ? 'opacity-50 bg-white shadow-md z-10' : 'bg-white hover:bg-slate-50/50'}`}>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none p-0.5 rounded text-slate-400 hover:text-slate-600" tabIndex={0} role="button" aria-label={`Reorder ${app.name}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
          </div>
          <span className="text-sm font-medium text-slate-800">{app.name}</span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-sm text-slate-600">{app.users}</td>
      <td className="py-2.5 px-3 text-sm text-slate-600">{app.hours}</td>
      <td className="py-2.5 px-3 text-sm text-slate-500">{app.date}</td>
    </tr>
  );
}

export default function AppActivityReportWidget() {
  const [open, setOpen] = useState(true);
  const [apps, setApps] = useState(INITIAL_APPS);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = apps.findIndex((a) => a.id === active.id);
    const newIndex = apps.findIndex((a) => a.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const next = [...apps];
    const [removed] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, removed);
    setApps(next);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100 flex-wrap shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">App Activity Report</h2>
            <p className="text-xs text-slate-500">View your comprehensive organizational app report</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Organization"><option>All Organization</option></select>
          <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Month"><option>Month</option></select>
          <button type="button" onClick={() => setOpen((o) => !o)} className="p-1.5 rounded-lg hover:bg-[#edf3ff] hover:text-[#5970ff] focus:outline-none focus:ring-2 focus:ring-blue-500" aria-expanded={open} aria-label={open ? 'Collapse' : 'Expand'}>
            <svg className={`w-4 h-4 text-slate-500 transition-transform ${open ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>
      {open && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto flex-1 min-h-0">
            <SortableContext items={apps.map((a) => a.id)} strategy={verticalListSortingStrategy}>
              <table className="w-full min-w-[320px]" aria-label="App activity">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="py-2 px-3 text-left text-xs font-semibold text-slate-600 uppercase">Application</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-slate-600 uppercase">Total Users</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-slate-600 uppercase">Total Number of Hours</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <SortableAppRow key={app.id} app={app} />
                  ))}
                </tbody>
              </table>
            </SortableContext>
          </div>
        </DndContext>
      )}
    </div>
  );
}
