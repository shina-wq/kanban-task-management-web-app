# Kanban Task Management — Build Plan

Angular routing lab built on the Frontend Mentor Kanban design.
Goal: **excellent but simple** code using modern Angular.

## Decisions

- [x] Design: full Frontend Mentor Kanban design (light/dark, responsive); sidebar always visible (no hide/show)
- [x] Extra screens in the same style: Boards overview, Settings, Login, Not Found
- [x] Every modal is a route (deep-linkable, browser Back closes it)
- [x] Modern Angular: standalone components, signals, `@if`/`@for`, `inject()`, functional guards, `OnPush`
- [x] Forms: template-driven (`FormsModule` + `ngModel`)
- [x] Drag and drop: `@angular/cdk/drag-drop` (move tasks between columns)
- [x] Styling: plain CSS + CSS variables (no UI library, no Tailwind)
- [x] Data: Frontend Mentor `data.json` as seed, persisted to `localStorage`
- [x] Deploy: Vercel (`vercel.json` SPA rewrite), deployed by the user
- [x] Git: you commit and push after each phase

## Angular concepts covered

| Concept                | Where                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------ |
| Components & templates | Standalone components, `@if` / `@for` / `@switch`                                    |
| Data binding & events  | `input()`, `output()`, `[class.x]`, `(click)`, `[(ngModel)]`                         |
| Directives             | Built-ins + custom `appClickOutside`                                                 |
| Lifecycle hooks        | `ngOnInit`, `DestroyRef` / `ngOnDestroy`, `afterNextRender`                          |
| Change detection       | `OnPush` everywhere, signals + `computed()`                                          |
| Services & DI          | `BoardService`, `ThemeService`, `AuthService` via `inject()`                         |
| Routing                | Lazy loading, child routes, params, query params, guards                             |

## Route map

```
''                         → redirect /boards
/login                     Login (public)
''  Shell                  canActivate: authGuard
 ├─ boards                 lazy: loadChildren → boards.routes.ts
 │   ├─ ''                 BoardsOverview
 │   ├─ new                BoardForm modal              canDeactivate
 │   └─ :boardId           BoardDetail  ?search=
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
  core/        models, services, guards
  shared/      modal, button, dropdown, clickOutside directive
  layout/      shell, sidebar, header, toast
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

- [x] Models: `Board`, `Column`, `Task`, `Subtask`
- [x] `BoardService` — signal state, CRUD for boards/tasks, toggle subtask, move task
- [x] `localStorage` persistence (seed on first load)
- [x] `ThemeService` — light/dark, persisted
- [x] `AuthService` — fake login/logout, `isLoggedIn` signal
- [ ] Commit (you)

### Phase 2 — Router config & shell layout (Tasks 2, 3, Bonus)

- [x] `provideRouter` with `withComponentInputBinding()`
- [x] Redirect `''` → `/boards`
- [x] Shell layout: sidebar + header + `<router-outlet>`
- [x] Sidebar: board list with `routerLink` + `routerLinkActive`
- [x] Sidebar: theme toggle (always visible, not collapsible)
- [x] Mobile: sidebar becomes header dropdown
- [x] `appClickOutside` directive
- [x] Not Found page (`**`)
- [x] Page titles via the route `title` property
- [x] Verify navigation without page reloads
- [ ] Commit (you)

### Phase 3 — Boards feature, lazy-loaded (Task 6)

- [x] `boards.routes.ts` loaded via `loadChildren`
- [x] Boards overview page (cards for all boards)
- [x] Board detail: columns + task cards ("x of y subtasks")
- [x] Empty board state ("This board is empty…")
- [x] Confirm separate lazy chunk in build output (`boards-routes`, loaded only on first visit)
- [ ] Commit (you)

### Phase 4 — Route & query params (Task 5)

- [x] `:boardId` drives the board shown
- [x] `tasks/:taskId` child route → TaskView modal
- [x] TaskView: subtask checkboxes + status dropdown
- [x] `?search=` query param (search button in the header expands into a search field)
- [x] Unknown board/task id → Not Found (`CanActivateFn` + `RedirectCommand`, URL kept)
- [x] Verify content updates when params change (no reload)
- [ ] Commit (you)

### Phase 5 — Forms, modals & programmatic navigation (Task 4)

- [x] Reusable modal component (native `<dialog>`, closes via router navigation) — done in Phase 4
- [x] Add/Edit Task form (title, description, subtasks list, status)
- [x] Add/Edit Board form (name, columns list)
- [x] Delete board / delete task confirm modals
- [x] Task routes grouped under a componentless `tasks/:taskId` parent (guard runs once)
- [x] Forms expose `hasUnsavedChanges()` for the Phase 7 guard
- [x] Validation errors ("Can't be empty")
- [x] Navigate programmatically after create/edit/delete
- [x] Confirmation toasts after create/edit/delete (`ToastService`)
- [ ] Commit (you)

### Phase 6 — Drag and drop

- [x] Add `@angular/cdk`
- [x] Drag task cards within and between columns
- [x] Moving a task updates its status + persists
- [x] Dragging is off while a search is active (filtered positions aren't real positions)
- [x] Board auto-scrolls while dragging (`CdkScrollable` on the board, kept in the lazy chunk)
- [ ] Commit (you)

### Phase 7 — Guards (Task 7)

- [x] Login page
- [x] `authGuard` (`CanActivateFn`) → `/login?returnUrl=…`
- [x] Redirect back to `returnUrl` after login
- [x] `guestGuard`: logged-in users visiting /login go to /boards
- [x] `unsavedChangesGuard` (`CanDeactivateFn`) on all forms (Escape, backdrop, links and browser Back)
- [x] `canceledNavigationResolution: 'computed'` keeps the URL right when Back is cancelled
- [x] Settings page (display name, theme) with guard + logout
- [ ] Commit (you)

### Phase 8 — Advanced routing (Tasks 4 & 6)

- [x] Auxiliary routes: not implemented (the lab only asks to discuss them; the Tips panel demo was removed)
- [ ] Commit (you)

### Phase 9 — Testing & verification (Task 8)

- [x] Manual checklist: every route, lazy chunks load on demand, guards block/allow, active link styling
- [x] Production build passes (0 warnings)
- [x] Prettier formatting check passes
- [x] No automated test suite (not required by the lab; the unit tests used during development were removed)
- [ ] Commit (you)

### Phase 10 — Deployment prep & docs (Task 9)

- [x] `vercel.json`: build command, output folder, SPA rewrite (deep links survive refresh)
- [x] README: overview, features, tech stack, routes, how to run, structure, live URL placeholder
- [ ] Commit (you)
- [ ] _(User)_ Push and deploy to Vercel, verify deep links + fallback route
