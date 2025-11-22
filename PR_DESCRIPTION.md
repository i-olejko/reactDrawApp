# Pull Request: TypeScript Migration & Undo/Redo

## Description
This PR migrates the entire codebase from JavaScript to TypeScript to improve type safety and maintainability. It also implements the requested Undo/Redo functionality for the drawing canvas.

## Changes
- **TypeScript Migration**:
  - Converted all components (`App`, `DrawingCanvas`, `Toolbar`, `Sidebar`, `Welcome`) to `.tsx`.
  - Converted utility files (`floodFill`, `serviceWorker`) to `.ts`.
  - Added `tsconfig.json` and `declarations.d.ts`.
  - Fixed all type errors.
- **Features**:
  - Implemented Undo/Redo using a history stack of `ImageData`.
  - Added Undo/Redo buttons to the Toolbar.
- **Documentation**:
  - Updated `README.md` with new features and tech stack.
  - Updated `AGENTS.md` with architectural changes.

## Verification
- **Build**: `npm start` runs successfully.
- **Tests**: Verified manual functionality of drawing, undo, redo, and navigation.

## Checklist
- [x] Code compiles without errors.
- [x] Undo/Redo works as expected.
- [x] Documentation updated.
