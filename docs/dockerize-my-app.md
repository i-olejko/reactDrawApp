# Dockerization and NPM Scripts Strategy

## Overview
This document outlines the strategy to dockerize the `draw-app` monorepo and establish a unified workflow for running the application both locally and in Docker containers.

## Goal
Enable seamless execution of the full stack application (Go backend + React frontend) using standardized `npm` scripts from the project root.

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **Go**: v1.22 or higher (Go 1.23 recommended)
- **Docker**: Latest stable version
- **npm**: v9.0.0 or higher

## Architecture
The application acts as a Monolith in deployment:
- **Frontend**: React app compiled to static HTML/CSS/JS.
- **Backend**: Go web server that serves the compiled frontend static files and handles API requests.
- **Docker**: A single container image encapsulates the binary and the static files.

## Components

### 1. Root `Dockerfile`
A multi-stage build process to create a lightweight production image.

*   **Stage 1: Frontend Builder**
    *   Base Image: `node:18-alpine`
    *   Action: Copies `frontend/` source, installs dependencies, runs `npm run build`.
    *   Output: `frontend/dist` directory.

*   **Stage 2: Backend Builder**
    *   Base Image: `golang:1.23-alpine` (matches go.mod requirement)
    *   Action: Copies `backend/go.mod` first for layer caching, then copies source and runs `go build`.
    *   Output: `main` binary (statically compiled with CGO_ENABLED=0).

*   **Stage 3: Final Runner**
    *   Base Image: `alpine:latest`
    *   Action: 
        *   Copies `main` binary from Stage 2.
        *   Copies `build` assets from Stage 1 to a `./public` directory.
    *   Command: Runs the Go binary.

### 2. Backend Modifications (`backend/main.go`)
The Go server needs to be aware of the frontend assets.
*   **API Routing Convention**: All API endpoints use the `/api/*` prefix to avoid conflicts with static file serving.
*   **Static File Serving**: Use `http.FileServer` to serve files from the `./public` directory.
*   **SPA Support**: Implements a custom handler that checks file existence before falling back to `index.html`, enabling React Router client-side navigation.
*   **Environment Configuration**: Port is configurable via `PORT` environment variable (defaults to 8080).

### 3. Root `package.json`
Acts as the orchestrator for development and docker commands.

*   **`npm run start-docker`**
    *   Builds the docker image: `docker build -t draw-app .`
    *   Runs the container: `docker run -p 8080:8080 draw-app`

*   **`npm run start-local`**
    *   Production-like local build and run:
        1.  **Build Frontend**: `cd frontend && npm run build`
        2.  **Prepare Assets**: Cross-platform copy of `frontend/dist` to `backend/public` using Node.js script.
        3.  **Build Backend**: `cd backend && go build -o main .`
        4.  **Run**: Executes binary (handles Windows `.exe` vs Unix differences).

*   **`npm run dev`** (Recommended for development)
    *   Runs frontend dev server with hot-reload: `cd frontend && npm start`
    *   Backend serves only API in dev mode (run separately with `npm run dev:backend` if needed)
    *   No build step required, faster iteration

## Directory Structure
```text
draw-app/
├── Dockerfile          # Root multi-stage Dockerfile
├── .dockerignore       # Excludes node_modules, build artifacts, .git
├── package.json        # Root script orchestrator
├── scripts/            # Cross-platform helper scripts
│   ├── copy-assets.js  # Copies frontend/dist to backend/public
│   ├── run-backend.js  # Runs backend binary (handles OS differences)
│   └── clean.js        # Cleans build artifacts
├── backend/
│   ├── main.go         # Modified to serve ./public with SPA routing
│   ├── go.mod
│   └── public/         # (Generated, gitignored) Static assets at runtime
└── frontend/           # React source
    └── build/          # (Generated, gitignored) Frontend build output
```

## Implementation Details

### .dockerignore
Optimizes Docker build context by excluding:
- `frontend/node_modules` and `frontend/dist`
- `backend/public` and binaries
- `.git` directory
- Documentation and IDE files

This significantly speeds up Docker builds and prevents stale assets from being included.

### Cross-Platform Compatibility
All build scripts use Node.js for cross-platform execution:
- **copy-assets.js**: Recursively copies files (works on Windows/Mac/Linux)
- **run-backend.js**: Detects OS and runs correct binary (`main.exe` on Windows, `main` elsewhere)
- **clean.js**: Removes build artifacts across platforms

### API Routing Convention
- All API endpoints must use `/api/*` prefix
- Example: `/api/hello`, `/api/users`, `/api/data`
- Static files are served from root (`/`, `/static/*`, etc.)
- SPA routes (e.g., `/dashboard`, `/profile`) automatically fall back to `index.html`

### Development vs Production Workflows

**Development** (recommended):
```bash
npm run dev              # Start frontend dev server with hot-reload
npm run dev:backend      # (Optional) Start backend for API testing
```
- Frontend runs on port 3000 with hot-reload
- Backend optional, only needed for API testing
- No build step required

**Production-like Local Build**:
```bash
npm run start-local      # Full build and run
```
- Builds frontend
- Copies to backend/public
- Builds and runs Go binary
- Serves everything from port 8080

**Docker**:
```bash
npm run start-docker     # Build image and run container
```
- Multi-stage build for optimized image
- Single container serves everything
- Production-ready deployment

## Health Check
Docker container includes health check:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
```

## Available NPM Scripts
```bash
npm run start-docker         # Build and run in Docker
npm run start-docker:detached # Run Docker in background
npm run stop-docker          # Stop running container
npm run start-local          # Production-like local build
npm run dev                  # Frontend dev server (recommended)
npm run dev:frontend         # Frontend dev server only
npm run dev:backend          # Backend dev server only
npm run build:frontend       # Build frontend only
npm run build:backend        # Build backend only
npm run copy:assets          # Copy frontend build to backend/public
npm run clean                # Remove all build artifacts
npm run install:all          # Install all dependencies
```
