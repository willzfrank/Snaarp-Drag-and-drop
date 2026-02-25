import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import StatCard from './widgets/StatCard';
import StorageWidget from './widgets/StorageWidget';
import FileSharingWidget from './widgets/FileSharingWidget';
import ActiveUsersWidget from './widgets/ActiveUsersWidget';
import DeviceManagementWidget from './widgets/DeviceManagementWidget';
import ProductivityReportWidget from './widgets/ProductivityReportWidget';
import OnlineUsersWidget from './widgets/OnlineUsersWidget';
import AppActivityReportWidget from './widgets/AppActivityReportWidget';
import WebActivityReportWidget from './widgets/WebActivityReportWidget';

const WIDGET_CONFIG = {
  users: {
    component: StatCard,
    props: { title: 'Users', value: '3,836', change: '15%', trend: 'down', icon: null },
    className: 'min-w-0',
  },
  groups: {
    component: StatCard,
    props: { title: 'Groups', value: '316', change: '23%', trend: 'up', icon: null },
    className: 'min-w-0',
  },
  storage: {
    component: StorageWidget,
    props: {},
    className: 'min-w-0',
  },
  uploads: {
    component: StatCard,
    props: { title: 'Uploads', value: '316', change: '23%', trend: 'up', icon: null },
    className: 'min-w-0',
  },
  departments: {
    component: StatCard,
    props: { title: 'Departments', value: '316', change: '23%', trend: 'down', icon: null },
    className: 'min-w-0',
  },
  'file-sharing': {
    component: FileSharingWidget,
    props: {},
    className: 'min-w-0',
  },
  'active-users': {
    component: ActiveUsersWidget,
    props: {},
    className: 'min-w-0',
  },
  'device-management': {
    component: DeviceManagementWidget,
    props: {},
    className: 'min-w-0 col-span-full',
  },
};

const CLOUD_NETWORK_IDS = ['users', 'groups', 'uploads', 'departments', 'storage', 'file-sharing', 'active-users'];

function SortableWidget({ id }) {
  const config = WIDGET_CONFIG[id];
  if (!config) return null;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    transition: { duration: 200 },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const Component = config.component;
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${config.className} ${isDragging ? 'opacity-50 shadow-lg z-10' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="relative cursor-grab active:cursor-grabbing touch-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-xl group"
        tabIndex={0}
        role="button"
        aria-label={`Drag to reorder ${id.replace(/-/g, ' ')} widget`}
      >
        <div className="absolute top-2 right-2 opacity-40 group-hover:opacity-70 text-slate-400 pointer-events-none" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
        </div>
        <Component {...config.props} />
      </div>
    </div>
  );
}

export default function DashboardGrid() {
  const { widgetOrder, moveWidget } = useDashboard();
  const [cloudNetworkOpen, setCloudNetworkOpen] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveWidget(active.id, over.id);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={widgetOrder} strategy={rectSortingStrategy}>
        <div className="pt-1.5">
        <div className="mb-6 rounded-lg border border-slate-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setCloudNetworkOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-2 px-6 py-4 text-left hover:bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            aria-expanded={cloudNetworkOpen}
            aria-label={cloudNetworkOpen ? 'Collapse Cloud Network' : 'Expand Cloud Network'}
          >
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <h1 className="text-lg font-semibold text-slate-800">Cloud Network</h1>
            </div>
            <svg className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${cloudNetworkOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {cloudNetworkOpen && (
            <>
              <div className="px-6 pb-2 flex items-center gap-2 text-sm text-slate-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Dashboard</span>
              </div>
              <div className="px-4 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-1.5 items-start">
                  {widgetOrder.filter((id) => CLOUD_NETWORK_IDS.includes(id)).map((id) => (
                    <SortableWidget key={id} id={id} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        {/* Device Management: separate section, same full width as Cloud Network */}
        <div className="pb-6">
          <DeviceManagementWidget />
        </div>
        {/* Productivity Report: separate section, collapsible */}
        <div className="pb-6">
          <ProductivityReportWidget />
        </div>
        {/* Online Users: table with row reorder */}
        <div className="pb-6">
          <OnlineUsersWidget />
        </div>
        {/* App Activity + Web Activity: side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-6">
          <AppActivityReportWidget />
          <WebActivityReportWidget />
        </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}
