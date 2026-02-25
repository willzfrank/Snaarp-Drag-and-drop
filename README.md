# Snaarp Dashboard – Drag & Drop

A React dashboard with **draggable widgets** and multiple report sections based on the Snaarp design. Built with React 19, Vite, Tailwind CSS, @dnd-kit, and Leaflet.

**Note:** Development focused more on functionality; there wasn’t time to refine the UI to match the design in detail.

## Run the project

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port Vite prints).

- **Build:** `npm run build`
- **Preview build:** `npm run preview`

## Features

- **Cloud Network (collapsible):** Section with 7 draggable widgets — Users, Groups, Uploads, Departments, Storage, File Sharing, Active Users. Reorder by dragging; keyboard supported (focus card, Space to pick up, arrows to move, Space to drop).
- **Device Management Dashboard (collapsible):** Five metric cards (e.g. Number Of Devices, Users, Emails) plus eight small cards (Windows, Mac, Linux, Organizations, etc.). Rows are independently reorderable via drag and drop.
- **Productivity Report (collapsible):** Four KPI cards (Hours Productivity, Days Activity, Users, Web Activity), Email Chart (donut), and Total Email (line chart). KPI row and chart row each support DnD reorder.
- **Online Users (collapsible):** Table with Name, Location, Organization, Device, Current Activity, Time Usage. Rows are draggable to reorder.
- **App Activity Report & Web Activity Report:** Two sections side by side (responsive grid). App Activity has a table (Application, Total Users, Hours, Date) with row DnD; Web Activity has a list with progress bars and time. Both are collapsible.
- **Active Users map:** Real map via Leaflet and OpenStreetMap with three user pins (Stanley, Samuel, Chisom); country list with progress bars beside it.
- **Layout:** Sidebar (Snaarp nav, user block), header (search with icon, notifications bell, Agent Code with copy), full-height layout with scroll only in main content.
- **Tech:** React (hooks), Context API for Cloud Network widget order, Tailwind CSS, @dnd-kit (core + sortable + utilities), Leaflet + react-leaflet for the map.

## Challenges & notes

- **Grid + sortable:** Cloud Network uses `@dnd-kit/sortable` with `rectSortingStrategy`. Widget order lives in `DashboardContext` and is passed into `SortableContext`.
- **Multiple DnD areas:** Device Management, Productivity Report, Online Users, App Activity, and Web Activity each have their own `DndContext` and local state for order, so reordering is scoped per section.
- **Activation distance:** Pointer sensor uses `distance: 8` so clicks on buttons/inputs don’t start a drag.
- **Accessibility:** Sortable items are focusable with keyboard (Space + arrows). Grip icon and `aria-label` on draggable elements.
- **Map:** Active Users uses Leaflet with OSM tiles; no API key required. Colored div icons for user pins.

## Structure

- `src/context/DashboardContext.jsx` — Cloud Network widget order state and `moveWidget`.
- `src/components/DashboardGrid.jsx` — Cloud Network (collapsible + SortableContext), then Device Management, Productivity Report, Online Users, and App/Web Activity sections.
- `src/components/Sidebar.jsx` — Nav, logo, user block.
- `src/components/Header.jsx` — Search (with icon), bell, Agent Code (with copy).
- `src/components/widgets/` — StatCard, StorageWidget, FileSharingWidget, ActiveUsersWidget (Leaflet map + country list), DeviceManagementWidget, ProductivityReportWidget, OnlineUsersWidget, AppActivityReportWidget, WebActivityReportWidget.
