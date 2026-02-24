import { createContext, useContext, useState, useCallback } from 'react';

const WIDGET_IDS = [
  'users',
  'groups',
  'storage',
  'uploads',
  'departments',
  'file-sharing',
  'active-users',
];

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [widgetOrder, setWidgetOrder] = useState(WIDGET_IDS);

  const moveWidget = useCallback((activeId, overId) => {
    setWidgetOrder((prev) => {
      const activeIndex = prev.indexOf(activeId);
      const overIndex = prev.indexOf(overId);
      if (activeIndex === -1 || overIndex === -1) return prev;
      const next = [...prev];
      const [removed] = next.splice(activeIndex, 1);
      next.splice(overIndex, 0, removed);
      return next;
    });
  }, []);

  return (
    <DashboardContext.Provider value={{ widgetOrder, moveWidget }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
