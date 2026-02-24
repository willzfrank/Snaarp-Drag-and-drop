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
import { useDashboard } from '../context/DashboardContext';
import StatCard from './widgets/StatCard';
import StorageWidget from './widgets/StorageWidget';
import FileSharingWidget from './widgets/FileSharingWidget';
import ActiveUsersWidget from './widgets/ActiveUsersWidget';

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
};

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 p-6">
          {widgetOrder.map((id) => (
            <SortableWidget key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
