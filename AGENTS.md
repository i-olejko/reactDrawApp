# Repository Guidelines

## Project Overview
`draw-app` is a child-friendly Progressive Web App (PWA) for drawing, built with React and TypeScript. It is optimized for touch input (iPad/tablets) and supports offline usage.

## Project Structure & Module Organization
- **Framework**: React (Create React App) with TypeScript.
- **State Management**: Centralized in `App.tsx` (tool, color, image, navigation, undo/redo).
- **Core Components**:
  - `DrawingCanvas.tsx`: Handles HTML5 Canvas logic, pointer events, rendering, and history stack.
  - `Toolbar.tsx`: UI for selecting tools, colors, brush size, and actions.
  - `Sidebar.tsx`: Navigation between "Welcome" and "Canvas" views.
  - `Welcome.tsx`: Landing page component.
- **Utilities**:
  - `floodFill.ts`: Custom non-recursive flood fill algorithm.
- **Styling**: CSS Modules (`*.module.css`) for component-scoped styles.
- **Assets**: Images in `public/img` and `src/assets`.
- **PWA**: Service worker setup in `service-worker.js` and `serviceWorkerRegistration.js`.

## Key Features & Implementation Details
- **Drawing Engine**: Uses `Pointer Events` API for unified mouse/touch handling. `touch-action: none` is critical for canvas interaction.
- **Undo/Redo**: Implemented using a history stack of `ImageData` in `DrawingCanvas.tsx`.
- **Flood Fill**: Custom non-recursive algorithm in `src/utils/floodFill.ts`.
- **Responsiveness**: Media queries in CSS modules handle layout adjustments for mobile/tablet.
- **Navigation**: Simple state-based routing (`currentPage` state in `App.tsx`).

## Development Guidelines
- **TypeScript**: Ensure all new code is typed. Use interfaces for props and state.
- **Testing**:
  - Write tests for logic in `utils/`.
  - Test UI components for responsiveness.
  - Verify touch interactions manually or with specialized mocks.
- **Commits**: Use imperative subjects (e.g., `feat: add sidebar`, `fix: canvas resize`).
- **Build**: `npm run build` for production. `npm run build-static` for standalone HTML version.

## PWA & Asset Notes
- Update `static.html` when changing the embedded UI.
- Ensure large hit areas for touch targets.
- Test offline functionality using DevTools Application tab.
