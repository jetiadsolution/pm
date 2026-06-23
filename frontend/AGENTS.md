# Frontend AGENTS — Code Overview

This file documents the existing frontend components and how the demo Kanban app is organized.

Quick start

Install dependencies and run the dev server in the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

Key files
- `src/components/KanbanBoard.tsx` — Main board component that renders columns and cards.
- `src/components/KanbanColumn.tsx` — Column UI and drop target for cards.
- `src/components/KanbanCard.tsx` — Card component used in the board and drag-and-drop.
- `src/components/KanbanCardPreview.tsx` — Small preview used in lists/tests.
- `src/components/NewCardForm.tsx` — Form to create a new card locally in the demo.
- `src/lib/kanban.ts` — Kanban utility functions (shape, helpers); includes unit tests in `lib/kanban.test.ts`.
- `src/app/page.tsx` and `src/app/layout.tsx` — Next.js app shell and the route that hosts the demo.

Tests
- The project uses Vitest. Run tests from the workspace root or `frontend`:

```bash
cd frontend
npm test
```

Notes for the agent
- The frontend is currently static/demo-first and does not persist to a backend.
- When integrating with the backend, add an API client module (e.g., `src/lib/api.ts`) and replace local state persistence with API calls.
- Keep UI changes minimal and maintain current component boundaries where possible.

If you'd like, I can expand this with component-level prop descriptions and example snapshots.