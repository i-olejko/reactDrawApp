# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A kid-friendly drawing PWA with a Go backend and React + TypeScript frontend in a monorepo structure. The backend serves as a simple HTTP server while the frontend provides interactive drawing capabilities with features like flood fill, undo/redo, and image import.

## Development Commands

### Frontend (from `frontend/` directory)
- `npm install` - Install dependencies
- `npm start` - Start development server (port 3000)
- `npm test` - Run Jest tests
- `npm run build` - Build production bundle
- `npm run build-static` - Build and copy static.html to public directory

### Backend (from `backend/` directory)
- `go run .` - Run backend server (port 8080)
- `go build` - Build binary
- `go test ./...` - Run tests (none currently exist)

### Docker
- Backend has its own `Dockerfile` for containerization
- `cloudbuild.yaml` orchestrates frontend build and backend Docker image creation for GCP deployment

## Architecture

### Monorepo Structure
```
draw-app/
├── backend/          # Go HTTP server
│   ├── main.go      # Simple HTTP handler on :8080
│   └── Dockerfile   # Multi-stage build (golang:1.23-alpine → alpine:latest)
├── frontend/         # React + TypeScript PWA
│   ├── src/
│   │   ├── App.tsx              # Root component with app state
│   │   ├── components/          # UI components
│   │   └── utils/               # Utilities (e.g., floodFill.ts)
│   └── public/
└── cloudbuild.yaml   # GCP build config
```

### State Management Pattern
- **Centralized in App.tsx**: All app state lives in `App.tsx` including navigation, tool selection, color, brush size, image data, and undo/redo flags
- **Props drilling**: State flows down to child components via props
- **Ref pattern**: `DrawingCanvas` exposes undo/redo methods via `useImperativeHandle` for parent control

### Component Responsibilities
- **App.tsx**: Navigation state, tool/color/brush state, image upload handling, undo/redo coordination
- **DrawingCanvas.tsx**: Canvas rendering, pointer event handling (unified mouse/touch via pointer events), history stack management, flood fill execution
- **Toolbar.tsx**: Tool selection UI, color picker, brush size controls, action buttons (undo/redo/clear)
- **Sidebar.tsx**: Navigation between Welcome and Canvas views
- **Welcome.tsx**: Landing page for starting blank or uploading image
- **utils/floodFill.ts**: Non-recursive flood fill algorithm using queue-based iteration

### Key Implementation Details

#### Canvas History System
- Managed entirely in `DrawingCanvas.tsx`
- Uses `ImageData[]` array for history stack
- `historyStep` tracks current position in stack
- On new drawing action: truncate future history, save state, increment step
- Undo/redo exposed via `DrawingCanvasRef` interface

#### Pointer Event Strategy
- Uses pointer events (not separate mouse/touch handlers) for unified handling
- `touch-action: none` CSS property prevents default touch behaviors
- Single code path for mouse, touch, and pen input

#### Image Handling
- Hardcoded image list in `App.tsx` (`imageList` array)
- Images stored in `frontend/public/img/`
- Uses `process.env.PUBLIC_URL` for GitHub Pages compatibility
- When adding public images, update the `imageList` array

#### PWA Configuration
- Service worker: `src/service-worker.js` (Workbox-based)
- Registration: `src/serviceWorkerRegistration.js`
- Registered in `src/index.tsx`
- Static HTML fallback: `public/static.html` (updated by `build-static` script)

## Testing

### Frontend Tests
- Framework: Jest + React Testing Library
- Test files: `frontend/src/components/*.test.tsx`
- Run with `npm test` from `frontend/` directory
- Canvas mocking: Uses `jest-canvas-mock` for canvas API tests

### Backend Tests
- No tests currently exist
- Standard Go test framework available (`go test ./...`)

## Styling Conventions
- CSS Modules for component styles (`*.module.css`)
- Global styles in `src/index.css`
- Each major component has its own module: `DrawingCanvas.module.css`, `Toolbar.module.css`, `Sidebar.module.css`, `Welcome.module.css`

## Critical Constraints
- Preserve `touch-action: none` on canvas element for touch device compatibility
- Maintain undo/redo history behavior when modifying canvas operations
- Keep TypeScript types explicit for props and component state
- Backend currently serves "Hello World" - not yet integrated to serve frontend static files (see docs/dockerize-my-app.md for planned integration strategy)
