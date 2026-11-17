# Kanban Task Management

A task board for organising work into boards, columns and tasks, built with Angular.
Based on the [Frontend Mentor Kanban challenge](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB).

## Features

- Create, edit and delete boards, columns and tasks
- Track subtasks and change a task's status
- Drag and drop tasks between columns
- Search tasks on a board
- Light and dark themes
- Responsive on mobile, tablet and desktop
- Everything is saved in your browser, with sample boards to start

> Log in with any name. There is no password, and no data leaves your browser.

## Tech stack

- [Angular 22](https://angular.dev) with signals and standalone components
- Angular Router for navigation, lazy loading and guards
- Angular CDK for drag and drop
- Plain CSS with custom properties for theming

## Getting started

You need [Node.js](https://nodejs.org) 22.22+ or 24.15+.

```bash
git clone https://github.com/shina-wq/kanban-task-management-web-app.git
cd kanban-task-management-web-app
npm install
npm start
```

Open http://localhost:4200.

| Command         | What it does                        |
| --------------- | ----------------------------------- |
| `npm start`     | Runs the dev server                 |
| `npm run build` | Builds for production into `dist/`  |

## Routes

Every page and modal has its own URL, so links, refresh and the Back button all work.

| URL                                       | Page                    |
| ----------------------------------------- | ----------------------- |
| `/login`                                  | Log in                  |
| `/boards`                                 | All boards              |
| `/boards/new`                             | Add a board             |
| `/boards/:boardId?search=`                | A board (with search)   |
| `/boards/:boardId/edit` or `/delete`      | Edit or delete a board  |
| `/boards/:boardId/tasks/new`              | Add a task              |
| `/boards/:boardId/tasks/:taskId`          | Task details            |
| `/boards/:boardId/tasks/:taskId/edit`     | Edit a task             |
| `/boards/:boardId/tasks/:taskId/delete`   | Delete a task           |
| `/settings`                               | Profile, theme and data |

## Project structure

```
src/app/
├── core/       # Models, services, guards
├── shared/     # Reusable UI: modal, menu, icon
├── layout/     # Header, sidebar, search, toasts
└── features/   # Pages: login, boards, settings, not found
```

## Deployment

Ready for [Vercel](https://vercel.com): import the repository and deploy.
`vercel.json` sends every URL to `index.html`, so deep links work on refresh.

## Credits

Design by [Frontend Mentor](https://www.frontendmentor.io).
