# Snaarp Dashboard – Drag & Drop

A React dashboard with **draggable widgets** based on the provided Snaarp design. Built with React 19, Vite, Tailwind CSS, and @dnd-kit.

## Run the project

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

- **Build:** `npm run build`
- **Preview build:** `npm run preview`

## Features

- **Drag and drop:** Reorder dashboard widgets (Users, Groups, Storage, Uploads, Departments, File Sharing, Active Users) by dragging. Keyboard reorder is supported (focus a card, Space to pick up, arrow keys to move, Space to drop).
- **Layout:** Sidebar navigation, top search/header, responsive grid of widget cards.
- **Tech:** React (hooks), Context API for widget order state, Tailwind CSS, @dnd-kit (core + sortable + utilities) for accessible DnD.

## Challenges & notes

- **Grid + sortable:** Used `@dnd-kit/sortable` with `rectSortingStrategy` so the grid reorders correctly on drop. Widget order is kept in React state and passed into `SortableContext`.
- **Activation distance:** Pointer sensor uses a small `distance: 8` so clicks on buttons/inputs inside cards don’t start a drag.
- **Accessibility:** Sortable items are focusable and support keyboard (Space + arrows). Drag handle is the whole card with an `aria-label`; a grip icon indicates draggability.

## Structure

- `src/context/DashboardContext.jsx` – widget order state and `moveWidget`.
- `src/components/DashboardGrid.jsx` – `DndContext`, `SortableContext`, and sortable widget wrapper.
- `src/components/widgets/` – StatCard, StorageWidget, FileSharingWidget, ActiveUsersWidget.
- `src/components/Sidebar.jsx`, `Header.jsx` – layout.
