# Kanban Task Management

A responsive Kanban board for organising work into boards, columns and tasks, built with Angular.

Design by [Frontend Mentor](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB)

## Features

- Boards, columns and tasks with subtasks, statuses and optional due dates
- Drag and drop tasks between columns
- Search tasks on a board
- Validated forms with clear, live error messages
- "Due today" and "Overdue" labels on tasks
- A warning before you leave a form with unsaved changes
- Light and dark themes, responsive from phone to desktop
- No backend: data is saved in your browser, with sample boards to start

Log in with any name. There's no password, and nothing leaves your browser.

## Getting started

Requires [Node.js](https://nodejs.org) 22.22+ or 24.15+.

```bash
git clone https://github.com/shina-wq/kanban-task-management-web-app.git
cd kanban-task-management-web-app
npm install
npm start
```

Then open http://localhost:4200.

| Command         | Description                       |
| --------------- | --------------------------------- |
| `npm start`     | Start the dev server              |
| `npm run build` | Build for production into `dist/` |

## Tech stack

- **[Angular 22](https://angular.dev):** standalone components, signals, OnPush change detection
- **[NgRx](https://ngrx.io):** store, effects and selectors for boards and tasks
- **RxJS:** a `BehaviorSubject` service for the theme
- **Angular Forms:** typed reactive forms with custom validators for tasks, template-driven forms elsewhere
- **Angular Router:** lazy loading, guards, and route params bound as component inputs
- **Angular CDK:** drag and drop
- **CSS:** plain CSS with custom properties for theming, no UI library

## How it works

- **Every view has a URL.** Boards, tasks and modals are routes (e.g. `/boards/:boardId/tasks/:taskId/edit`), so links, refresh and the Back button all work.
- **One task form for add and edit.** `AddTask` and `EditTask` share a `TaskForm` that validates the input and emits the result.
- **Guards** protect unsaved forms and redirect missing boards and tasks to a Not Found page.
- **Boards and tasks live in an NgRx store.** Components call `BoardService`, which dispatches actions; effects load boards at startup and save them to `localStorage` after each change. Open [Redux DevTools](https://github.com/reduxjs/redux-devtools) to watch every action.
- **The theme lives in a service.** `ThemeService` holds it in a `BehaviorSubject`: one value, so no store needed.

## Project structure

```
src/app/
├── core/       # Models, services, NgRx store, utils, validators
├── shared/     # Reusable UI: modal, menu, icon, due date
├── layout/     # Header, sidebar, search, toasts
└── features/   # Login, boards and tasks, settings, not found
```

## Branches

| Branch                    | Adds                                                                |
| ------------------------- | ------------------------------------------------------------------- |
| `main`                    | The app: components, routing, guards, drag and drop, forms          |
| `lab-13-forms`            | Reactive task form, custom validators, due dates                    |
| `lab-16-state-management` | NgRx store (actions, reducer, effects, selectors), RxJS theme state |

## Deployment

Configured for [Vercel](https://vercel.com): import the repository and deploy. `vercel.json` rewrites every URL to `index.html`, so deep links work on refresh.
