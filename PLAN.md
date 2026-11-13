# Kanban Task Management — Build Plan

Angular routing lab built on the Frontend Mentor Kanban design.
Goal: **excellent but simple** code using modern Angular.

## Decisions

- [x] Design: full Frontend Mentor Kanban design (light/dark, hide sidebar, responsive)
- [x] Extra screens in the same style: Boards overview, Settings, Login, Not Found
- [x] Every modal is a route (deep-linkable, browser Back closes it)
- [x] Modern Angular: standalone components, signals, `@if`/`@for`, `inject()`, functional guards, `OnPush`
- [x] Forms: template-driven (`FormsModule` + `ngModel`)
- [x] Drag and drop: `@angular/cdk/drag-drop` (move tasks between columns)
- [x] Styling: plain CSS + CSS variables (no UI library, no Tailwind)
- [x] Data: Frontend Mentor `data.json` as seed, persisted to `localStorage`
- [x] Deploy: Vercel (`vercel.json` SPA rewrite), deployed by the user
- [x] Git: commit after each phase, no pushing

## Angular concepts covered

| Concept | Where |
|---|---|
| Components & templates | Standalone components, `@if` / `@for` / `@switch` |
| Data binding & events | `input()`, `output()`, `[class.x]`, `(click)`, `[(ngModel)]` |
| Directives | Built-ins + custom `appClickOutside` |
| Lifecycle hooks | `ngOnInit`, `DestroyRef` / `ngOnDestroy`, `afterNextRender` |
| Change detection | `OnPush` everywhere, signals + `computed()` |
| Services & DI | `BoardService`, `ThemeService`, `AuthService` via `inject()` |
| Routing | Lazy loading, child routes, params, query params, guards, preloading, aux route |

## Route map

```
''                         → redirect /boards
/login                     Login (public)
''  Shell                  canActivate: authGuard
 ├─ boards                 lazy: loadChildren → boards.routes.ts
 │   ├─ ''                 BoardsOverview
 │   ├─ new                BoardForm modal              canDeactivate
 │   └─ :boardId           BoardDetail  ?search=&sort=
 │       ├─ edit           BoardForm modal              canDeactivate
 │       ├─ delete         ConfirmDelete modal
 │       ├─ tasks/new      TaskForm modal               canDeactivate
 │       └─ tasks/:taskId  TaskView modal
 │           ├─ edit       TaskForm modal               canDeactivate
 │           └─ delete     ConfirmDelete modal
 ├─ settings               lazy: loadComponent          canDeactivate
 └─ **                     NotFound
```

## Folder structure

```
src/app/
  core/        models, services, guards, preloading strategy
  shared/      modal, button, dropdown, clickOutside directive
  layout/      shell, sidebar, header, loading bar
  features/
    auth/      login
    boards/    boards.routes.ts + board/task components
    settings/
    not-found/
```

---

## Checklist

### Phase 0 — Project setup (Lab Task 1)
- [x] `ng new` with CSS, standalone, strict mode
- [x] Remove boilerplate (default template, styles)
- [x] Add Plus Jakarta Sans font
- [x] Design tokens as CSS variables (colors, typography, spacing)
- [x] Light/dark theme variables (`[data-theme="dark"]`)
- [x] Add icons/logo as SVG assets (used as CSS masks so they follow the theme)
- [x] Add seed data (`core/data/seed-data.json`, Frontend Mentor shape + ids)
- [x] App runs with `ng serve`
- [x] Commit

### Phase 1 — Data layer & services
- [ ] Models: `Board`, `Column`, `Task`, `Subtask`
- [ ] `BoardService` — signal state, CRUD for boards/tasks, toggle subtask, move task
- [ ] `localStorage` persistence (seed on first load)
- [ ] `ThemeService` — light/dark, persisted
- [ ] `AuthService` — fake login/logout, `isLoggedIn` signal
- [ ] Commit

### Phase 2 — Router config & shell layout (Tasks 2, 3, Bonus)
- [ ] `provideRouter` with `withComponentInputBinding()`
- [ ] Redirect `''` → `/boards`
- [ ] Shell layout: sidebar + header + `<router-outlet>`
- [ ] Sidebar: board list with `routerLink` + `routerLinkActive`
- [ ] Sidebar: theme toggle, hide/show sidebar
- [ ] Mobile: sidebar becomes header dropdown
- [ ] `appClickOutside` directive
- [ ] Not Found page (`**`)
- [ ] Verify navigation without page reloads
- [ ] Commit

### Phase 3 — Boards feature, lazy-loaded (Task 6)
- [ ] `boards.routes.ts` loaded via `loadChildren`
- [ ] Boards overview page (cards for all boards)
- [ ] Board detail: columns + task cards ("x of y subtasks")
- [ ] Empty board state ("This board is empty…")
- [ ] Confirm separate lazy chunk in build output
- [ ] Commit

### Phase 4 — Route & query params (Task 5)
- [ ] `:boardId` drives the board shown
- [ ] `tasks/:taskId` child route → TaskView modal
- [ ] TaskView: subtask checkboxes + status dropdown
- [ ] `?search=` filter and `?sort=` query params
- [ ] Unknown board/task id → Not Found
- [ ] Verify content updates when params change (no reload)
- [ ] Commit

### Phase 5 — Forms, modals & programmatic navigation (Task 4)
- [ ] Reusable modal component (closes via router navigation)
- [ ] Add/Edit Task form (title, description, subtasks list, status)
- [ ] Add/Edit Board form (name, columns list)
- [ ] Delete board / delete task confirm modals
- [ ] Validation errors ("Can't be empty")
- [ ] Navigate programmatically after create/edit/delete
- [ ] Commit

### Phase 6 — Drag and drop
- [ ] Add `@angular/cdk`
- [ ] Drag task cards within and between columns
- [ ] Moving a task updates its status + persists
- [ ] Commit

### Phase 7 — Guards (Task 7)
- [ ] Login page
- [ ] `authGuard` (`CanActivateFn`) → `/login?returnUrl=…`
- [ ] Redirect back to `returnUrl` after login
- [ ] `unsavedChangesGuard` (`CanDeactivateFn`) on all forms
- [ ] Settings page (display name, theme) with guard + logout
- [ ] Commit

### Phase 8 — Advanced routing (Tasks 4 & 6)
- [ ] Loading bar from Router events (Start / End / Cancel / Error)
- [ ] Navigation error handling
- [ ] Custom preloading strategy (`data: { preload: true }`)
- [ ] Auxiliary route demo (named outlet)
- [ ] Commit

### Phase 9 — Testing & verification (Task 8)
- [ ] Unit tests: `authGuard`, `unsavedChangesGuard`
- [ ] Unit tests: `BoardService`
- [ ] Manual checklist: every route, lazy chunks load on demand, guards block/allow, active link styling
- [ ] Production build passes
- [ ] Commit

### Phase 10 — Deployment prep & docs (Task 9)
- [ ] `vercel.json` SPA rewrite (deep links survive refresh)
- [ ] README: overview, route map, concepts, how to run, live URL placeholder
- [ ] Commit
- [ ] *(User)* Push and deploy to Vercel, verify deep links + fallback route
