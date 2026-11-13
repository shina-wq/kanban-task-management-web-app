# Kanban Task Management

A Kanban board for organising tasks across boards and columns, built with Angular 22.
Based on the [Frontend Mentor](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB) Kanban task management design.

## Features

- Create, edit and delete boards, columns and tasks
- Track subtasks and change a task's status from its details view
- Drag and drop tasks between and within columns
- Search tasks on a board
- Light and dark themes, following your system setting by default
- Responsive layout for mobile, tablet and desktop
- Data saved in your browser (localStorage), with sample boards on first visit

Log in with any display name. There is no password and nothing leaves your browser.

## Tech stack

- Angular 22
- Angular Router
- Angular CDK
- Plain CSS with custom properties for theming

## Routes

| URL                                     | Page                         |
| --------------------------------------- | ---------------------------- |
| `/login`                                | Log in                       |
| `/boards`                               | All boards                   |
| `/boards/new`                           | Add a board                  |
| `/boards/:boardId?search=`              | A board, optionally filtered |
| `/boards/:boardId/edit` · `/delete`     | Edit or delete a board       |
| `/boards/:boardId/tasks/new`            | Add a task                   |
| `/boards/:boardId/tasks/:taskId`        | Task details                 |
| `/boards/:boardId/tasks/:taskId/edit`   | Edit a task                  |
| `/boards/:boardId/tasks/:taskId/delete` | Delete a task                |
| `/settings`                             | Profile, theme and data      |
| `**`                                    | Page not found               |

Every modal has its own URL, so links and the browser's Back button work as expected.
All pages except Log In require logging in, and forms ask before you leave with unsaved changes.

## Getting started

Requires **Node.js** 22.22+ or 24.15+.

```bash
npm install
npm start
```

Then open http://localhost:4200.

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm start`     | Start the dev server          |
| `npm run build` | Production build into `dist/` |

## Project structure

```
src/app/
├── core/       # Models, services, guards and routing helpers
├── shared/     # Reusable UI: modal, menu, icon, click-outside directive
├── layout/     # App shell: header, sidebar, search, toasts, loading bar
└── features/   # Pages: auth, boards (lazy-loaded), settings, not-found
```

## Deployment

The app is set up for [Vercel](https://vercel.com). `vercel.json` sets the build command, the
output folder, and a rewrite to `index.html` so deep links work on refresh.

## Credits

Design by [Frontend Mentor](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB) (Kanban task management web app challenge).
