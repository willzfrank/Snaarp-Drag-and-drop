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

const INITIAL_USERS = [
  { id: '1', name: 'Annette Black', location: 'Ottawa, Canada', organization: 'MSBM, Ottawa', device: 'Windows', activity: 'Google Chrome', time: '3 hours 12 minutes', online: true, initials: 'AB' },
  { id: '2', name: 'Floyd Miles', location: 'Lagos, Nigeria', organization: 'MSBM, Lagos', device: 'Mac', activity: 'Instagram', time: '2 hours 8 minutes', online: true, initials: 'FM' },
  { id: '3', name: 'Ralph Edwards', location: 'London, UK', organization: 'MSBM, London', device: 'Linux', activity: 'Microsoft Teams', time: '1 hour 45 minutes', online: false, initials: 'RE' },
  { id: '4', name: 'Jane Cooper', location: 'New York, USA', organization: 'MSBM, New York', device: 'Windows', activity: 'YouTube', time: '4 hours 20 minutes', online: true, initials: 'JC' },
  { id: '5', name: 'Devon Lane', location: 'Dubai, UAE', organization: 'MSBM, Dubai', device: 'Mac', activity: 'Opera Mini', time: '45 minutes', online: true, initials: 'DL' },
  { id: '6', name: 'Courtney Henry', location: 'Toronto, Canada', organization: 'MSBM, Toronto', device: 'Windows', activity: 'WhatsApp', time: '2 hours 30 minutes', online: false, initials: 'CH' },
  { id: '7', name: 'Wade Warren', location: 'Sydney, Australia', organization: 'MSBM, Sydney', device: 'Mac', activity: 'Google Chrome', time: '5 hours 15 minutes', online: true, initials: 'WW' },
  { id: '8', name: 'Kristin Watson', location: 'Berlin, Germany', organization: 'MSBM, Berlin', device: 'Linux', activity: 'Microsoft Teams', time: '1 hour 0 minutes', online: true, initials: 'KW' },
  { id: '9', name: 'Cameron Williamson', location: 'Paris, France', organization: 'MSBM, Paris', device: 'Windows', activity: 'YouTube', time: '2 hours 55 minutes', online: false, initials: 'CW' },
  { id: '10', name: 'Leslie Alexander', location: 'Lagos, Nigeria', organization: 'MSBM, Lagos', device: 'Mac', activity: 'Instagram', time: '3 hours 40 minutes', online: true, initials: 'LA' },
];

const DEVICE_ICONS = {
  Windows: () => <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5.5L10.5 4v7.5H3M10.5 12H3v6.5l7.5-1.5M12 4l8.5-1.5V12H12M12 20v-7.5h8.5V20L12 20z" /></svg>,
  Mac: () => <svg className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>,
  Linux: () => <svg className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="currentColor"><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489.123.805.489 1.564 1.052 2.119.564.555 1.27.908 2.065 1.044.795.137 1.658.057 2.447-.229.789-.286 1.513-.761 2.096-1.385.584-.624 1.027-1.387 1.285-2.206.257-.819.324-1.684.193-2.525-.131-.841-.461-1.647-.959-2.333.696-.104 1.47-.361 2.047-.896.576-.535.954-1.248 1.085-2.028.13-.78.009-1.609-.345-2.333-.354-.724-.925-1.341-1.607-1.772-.682-.431-1.465-.665-2.248-.665-.27 0-.539.023-.803.069.069-.319.104-.649.104-.982 0-1.444-.591-2.748-1.543-3.693C14.256.582 12.953 0 11.509 0h.995z" /></svg>,
};

function SortableRow({ user }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: user.id, transition: { duration: 200 } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const DeviceIcon = DEVICE_ICONS[user.device] || DEVICE_ICONS.Windows;
  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-slate-100 last:border-0 ${isDragging ? 'opacity-50 bg-white shadow-md z-10' : 'bg-white hover:bg-slate-50/50'}`}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none p-1 rounded text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} role="button" aria-label={`Drag to reorder ${user.name}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700 shrink-0">
            {user.initials}
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${user.online ? 'bg-emerald-500' : 'bg-slate-300'}`} aria-hidden />
            <span className="text-sm font-medium text-slate-800 truncate">{user.name}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-slate-600">{user.location}</td>
      <td className="py-3 px-4 text-sm text-slate-600">{user.organization}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <DeviceIcon />
          <span>{user.device}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-slate-600">{user.activity}</td>
      <td className="py-3 px-4 text-sm text-slate-600">{user.time}</td>
    </tr>
  );
}

export default function OnlineUsersWidget() {
  const [open, setOpen] = useState(true);
  const [users, setUsers] = useState(INITIAL_USERS);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = users.findIndex((u) => u.id === active.id);
    const newIndex = users.findIndex((u) => u.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const next = [...users];
    const [removed] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, removed);
    setUsers(next);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Online Users</h2>
          <p className="text-sm text-slate-500 mt-0.5">View your comprehensive online users</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Organization">
            <option>All Organization</option>
          </select>
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
          <div className="overflow-x-auto">
            <SortableContext items={users.map((u) => u.id)} strategy={verticalListSortingStrategy}>
              <table className="w-full min-w-[700px]" aria-label="Online users">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Organization</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Device</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Current Activity</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Time Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <SortableRow key={user.id} user={user} />
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
