# Kids Drawing App - Progressive Web App

A child-friendly drawing application optimized for iPad touch input, built as a Progressive Web App (PWA) with React and TypeScript. This application allows users to upload their own images and draw over them using HTML5 Canvas for smooth, freehand drawing.

## Features

### Core Functionality
- **Image Upload**: Users can upload their own images to draw on
- **Freehand Drawing**: Smooth drawing using pointer events and touch input
- **Color Fill Tool**: Paint bucket tool to fill areas with colors
- **Brush Size Control**: Adjustable brush sizes
- **Color Selection**: Comprehensive color palette with color picker
- **Undo/Redo**: Easily correct mistakes with undo and redo buttons
- **Offline Support**: Works without internet connection
- **PWA Installable**: Can be added to home screen on mobile devices

### Technical Features
- **TypeScript**: Fully typed codebase for better maintainability and safety
- **HTML5 Canvas**: High-performance drawing engine
- **Pointer Events API**: Unified handling for mouse and touch input with `touch-action: none`
- **Optimized Algorithms**: Efficient non-recursive flood-fill implementation
- **Service Workers**: Robust offline functionality via Workbox
- **Child-friendly UI**: Large buttons, clear icons, and responsive layout

## Getting Started

### Quick Start with Static Version
1. Open the `public/static.html` file directly in a browser to use the standalone version

### Running the React App in Web
https://i-olejko.github.io/reactDrawApp/public/static.html

#### Prerequisites
- Node.js and npm installed

#### Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
```bash
npm install
```

#### Development
Start the development server:
```bash
npm start
```

#### Build for Production
Create a production build:
```bash
npm run build
```

## Implementation Details

### Project Structure
- `/public` - Static assets and standalone HTML version
- `/src` - React source code (TypeScript)
  - `/components` - React components (`.tsx`)
  - `/utils` - Utility functions (`.ts`)
  - `/hooks` - Custom React hooks

### Key Components
- **Welcome Component**: Landing page with app introduction
- **DrawingCanvas**: Core canvas implementation with drawing logic and history stack
- **Toolbar**: UI controls for tools, colors, brush sizes, and actions
- **Sidebar**: Navigation menu

### Technical Choices
- **Direct Canvas API**: Used for maximum performance and control
- **Iterative Flood Fill**: Non-recursive implementation for better performance
- **Pointer Events**: Captures both mouse and touch input with high precision
- **React + TypeScript**: Modern, type-safe component architecture

## Roadmap & Planned Improvements

### Phase 1: Core Experience (High Priority)
- [x] **Undo/Redo**: Essential functionality to fix mistakes (History stack approach).
- [ ] **New Tools**:
  - **Eraser**: Dedicated tool for erasing.
  - **Shapes**: Drag-and-drop circles, squares, stars.
  - **Stickers**: Pre-made assets.
- [ ] **Settings & Customization**:
  - **Backgrounds**: Option to choose solid colors or coloring book templates.
  - **Settings Page**: UI to toggle backgrounds and manage preferences.

### Phase 2: Engagement & Polish
- **Sound Effects**: Audio feedback for drawing and interactions.
- **Animations**: Smooth transitions and button effects.
- **Save & Share**: Export drawings to device gallery (Lower priority).

### Phase 3: Advanced Features
- Apple Pencil support with pressure sensitivity.
- AI-generated image backgrounds.
- Drawing layers and layer management.

## Browser Compatibility
- Chrome (desktop & mobile)
- Safari (desktop & mobile)
- Firefox (desktop & mobile)
- Edge

## License
MIT

---

This project is designed as a fun, educational tool for children to express their creativity through digital drawing.