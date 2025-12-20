# Repository Guidelines

## Project Overview
- This repo contains a Go backend and a React + TypeScript frontend for a kid-friendly drawing PWA.
- The backend is a simple HTTP server that responds on `/` and listens on `:8080`.

## Project Structure
- `backend/` Go service (`main.go`, `go.mod`, `Dockerfile`).
- `frontend/` Create React App (TypeScript) with components, utilities, and PWA assets.
- `cloudbuild.yaml` for build/deploy automation.

## Frontend Architecture
- `frontend/src/App.tsx` owns app state (navigation, tool, color, brush size, image, undo/redo flags).
- `frontend/src/components/DrawingCanvas.tsx` implements canvas rendering, pointer events, history stack, and flood fill.
- `frontend/src/components/Toolbar.tsx` exposes tool/color/brush/actions UI.
- `frontend/src/components/Sidebar.tsx` handles navigation between Welcome and Canvas views.
- `frontend/src/components/Welcome.tsx` is the landing screen.
- `frontend/src/utils/floodFill.ts` contains the non-recursive flood fill implementation.
- Styling is mostly via CSS Modules (`*.module.css`) plus some global CSS.
- PWA setup uses Workbox (`src/service-worker.js`) and registers in `src/index.tsx`.
- `frontend/public/static.html` is a standalone static entry (updated by `npm run build-static`).

## Backend Notes
- Plain `net/http` server with no routing framework.
- Dockerfile uses a multi-stage build and exposes port `8080`.

## Development Commands
- Frontend: `npm install`, `npm start`, `npm test`, `npm run build`, `npm run build-static`.
- Backend: from `backend/`, `go run .` (or `go build` to produce a binary).

## Implementation Guidelines
- Keep TypeScript typings explicit for props and state.
- Canvas changes should preserve undo/redo history behavior in `DrawingCanvas.tsx`.
- Keep `touch-action: none` on the canvas to preserve pointer events on touch devices.
- If adding new public images, update the image list in `App.tsx` (currently hardcoded).
- If editing PWA behavior, check both `service-worker.js` and `serviceWorkerRegistration.js`.

## Testing
- Frontend tests use Jest + React Testing Library (`frontend/src/components/*.test.*`).
- There are no backend tests yet.
