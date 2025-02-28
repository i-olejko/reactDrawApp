# Kids Drawing App - Progressive Web App

A child-friendly drawing application optimized for iPad touch input, built as a Progressive Web App (PWA) with React. This application allows users to upload their own images and draw over them using HTML5 Canvas for smooth, freehand drawing.

## Features

### Core Functionality
- **Image Upload**: Users can upload their own images to draw on
- **Freehand Drawing**: Smooth drawing using pointer events and touch input
- **Color Fill Tool**: Paint bucket tool to fill areas with colors
- **Brush Size Control**: Adjustable brush sizes
- **Color Selection**: Comprehensive color palette with color picker
- **Offline Support**: Works without internet connection
- **PWA Installable**: Can be added to home screen on mobile devices

### Technical Features
- HTML5 Canvas for high-performance drawing
- Pointer Events API with touch-action: none for better touch handling
- Optimized flood-fill algorithm for the paint bucket tool
- Service workers for offline functionality
- Child-friendly UI with large buttons and clear icons
- Responsive design that works on various screen sizes

## Getting Started

### Quick Start with Static Version
1. Open the `public/static.html` file directly in a browser to use the standalone version

### Running the React App

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
- `/src` - React source code
  - `/components` - React components
  - `/utils` - Utility functions, including the flood fill algorithm
  - `/hooks` - Custom React hooks

### Key Components
- **Welcome Component**: Landing page with app introduction
- **DrawingCanvas**: Canvas implementation with drawing logic
- **Toolbar**: UI controls for tools, colors, and brush sizes

### Technical Choices
- **Direct Canvas API**: Used for maximum performance and control
- **Iterative Flood Fill**: Non-recursive implementation for better performance
- **Pointer Events**: Captures both mouse and touch input with high precision

## Future Enhancements
- Apple Pencil support with pressure sensitivity
- AI-generated image backgrounds
- Drawing layers and layer management
- Undo/Redo functionality
- Save and share drawings
- More drawing tools (shapes, text, stickers)

## Browser Compatibility
- Chrome (desktop & mobile)
- Safari (desktop & mobile)
- Firefox (desktop & mobile)
- Edge

## License
MIT

---

This project is designed as a fun, educational tool for children to express their creativity through digital drawing.