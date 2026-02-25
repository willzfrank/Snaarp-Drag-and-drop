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

const INITIAL_ITEMS = [
  { id: '1', name: 'Chrome', pct: 78, time: '5 hours 12 minutes' },
  { id: '2', name: 'Gmail', pct: 61, time: '2 hours 24 minutes' },
  { id: '3', name: 'Firefox', pct: 45, time: '40 minutes' },
  { id: '4', name: 'Instagram', pct: 78, time: '5 hours 6 minutes' },
  { id: '5', name: 'X.com', pct: 59, time: '1 hour 8 minutes' },
  { id: '6', name: 'Facebook', pct: 61, time: '3 hours 1 minute' },
];

function SortableWebRow({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, transition: { duration: 200 } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 py-2.5 px-3 border-b border-slate-100 last:border-0 bg-white hover:bg-slate-50/50 ${isDragging ? 'opacity-50 shadow-md z-10' : ''}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none p-0.5 rounded text-slate-400 hover:text-slate-600 shrink-0" tabIndex={0} role="button" aria-label={`Reorder ${item.name}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
      </div>
      <span className="text-sm font-medium text-slate-800 w-20 shrink-0">{item.name}</span>
      <div className="flex-1 min-w-0">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${item.pct}%` }} role="progressbar" aria-valuenow={item.pct} aria-valuemin={0} aria-valuemax={100} />
        </div>
      </div>
      <span className="text-sm text-slate-600 shrink-0">{item.pct}%</span>
      <span className="text-xs text-slate-500 shrink-0">{item.time}</span>
    </div>
  );
}

export default function WebActivityReportWidget() {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState(INITIAL_ITEMS);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const next = [...items];
    const [removed] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, removed);
    setItems(next);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100 flex-wrap shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Web Activity Report</h2>
            <p className="text-xs text-slate-500">View your comprehensive organizational web report</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Month"><option>Month</option></select>
          <button type="button" onClick={() => setOpen((o) => !o)} className="p-1.5 rounded-lg hover:bg-[#edf3ff] hover:text-[#5970ff] focus:outline-none focus:ring-2 focus:ring-blue-500" aria-expanded={open} aria-label={open ? 'Collapse' : 'Expand'}>
            <svg className={`w-4 h-4 text-slate-500 transition-transform ${open ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>
      {open && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex-1 min-h-0 overflow-auto">
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <SortableWebRow key={item.id} item={item} />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      )}
    </div>
  );
}
