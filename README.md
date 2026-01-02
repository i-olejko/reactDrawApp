# Draw App

A full-stack drawing application with a Go backend and React frontend, configured as a monorepo with Docker support.

## Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Go**: v1.22 or higher
- **Docker**: Latest stable version (optional, for containerized deployment)

### Development (Recommended)

For fastest iteration with hot-reload:

```bash
# Install all dependencies
npm run install:all

# Start frontend dev server (port 3000)
npm run dev

# (Optional) In another terminal, start backend API server (port 8080)
npm run dev:backend
```

The frontend dev server will proxy API requests to the backend if needed.

### Production-like Local Build

To test the full production setup locally:

```bash
npm run start-local
```

This will:
1. Build the React frontend
2. Copy assets to backend/public
3. Build the Go backend
4. Start the server on http://localhost:8080

### Docker

To build and run in a Docker container:

```bash
# Build and run (foreground)
npm run start-docker

# Or run in background
npm run start-docker:detached

# Stop background container
npm run stop-docker
```

Access the application at http://localhost:8080

## Project Structure

```
draw-app/
├── backend/           # Go backend server
│   ├── main.go       # Main server with static file serving
│   └── public/       # (Generated) Frontend build artifacts
├── frontend/         # React frontend application
│   └── src/         # React source code
├── scripts/         # Build and deployment scripts
├── docs/            # Documentation
├── Dockerfile       # Multi-stage Docker build
└── package.json     # Root orchestration scripts
```

## API Routing

All API endpoints use the `/api/*` prefix:

- `/api/hello` - Example API endpoint
- `/api/*` - All your API routes go here

Static files and SPA routes are served from root:
- `/` - React app entry point
- `/static/*` - Static assets (JS, CSS, images)
- Client-side routes (e.g., `/dashboard`) automatically work with React Router

## Available Scripts

### Development
- `npm run dev` - Start frontend dev server with hot-reload
- `npm run dev:frontend` - Frontend dev server only
- `npm run dev:backend` - Backend dev server only

### Building
- `npm run build:frontend` - Build React app
- `npm run build:backend` - Build Go binary
- `npm run copy:assets` - Copy frontend build to backend/public

### Running
- `npm run start-local` - Full production-like build and run
- `npm run start-docker` - Build and run Docker container
- `npm run start-docker:detached` - Run Docker in background

### Utilities
- `npm run clean` - Remove all build artifacts
- `npm run install:all` - Install dependencies for all packages
- `npm run stop-docker` - Stop running Docker container

## Development Workflow

### Working on Frontend Only
```bash
npm run dev
```
Frontend runs on port 3000 with hot-reload. No backend needed unless testing API calls.

### Working on Backend Only
```bash
npm run dev:backend
```
Backend serves API on port 8080. Use with frontend dev server for full-stack development.

### Full-Stack Development
Terminal 1:
```bash
npm run dev:backend
```

Terminal 2:
```bash
npm run dev
```

### Testing Production Build Locally
```bash
npm run start-local
```

### Deploying with Docker
```bash
npm run start-docker
```

## Environment Variables

### Backend
- `PORT` - Server port (default: 8080)

Set in your shell or via `.env` file:
```bash
PORT=3000 npm run dev:backend
```

## Docker Details

The Dockerfile uses a multi-stage build:

1. **Frontend Builder** - Builds React app with Node.js
2. **Backend Builder** - Builds Go binary
3. **Final Image** - Minimal Alpine Linux with binary and static files

Benefits:
- Small final image size
- Fast builds with layer caching
- Production-ready optimization

## Cross-Platform Support

All scripts are cross-platform and work on:
- Windows
- macOS
- Linux

Binary naming (`main.exe` vs `main`) and file operations are handled automatically.

## Contributing

1. Make changes to frontend or backend
2. Test locally with `npm run dev`
3. Test production build with `npm run start-local`
4. Test Docker build with `npm run start-docker`
5. Clean artifacts with `npm run clean` when needed

## Documentation

See [docs/dockerize-my-app.md](docs/dockerize-my-app.md) for detailed architecture and implementation information.

## License

ISC
