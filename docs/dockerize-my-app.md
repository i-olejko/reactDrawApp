# Dockerization and NPM Scripts Strategy

## Overview
This document outlines the strategy to dockerize the `draw-app` monorepo and establish a unified workflow for running the application both locally and in Docker containers.

## Goal
Enable seamless execution of the full stack application (Go backend + React frontend) using standardized `npm` scripts from the project root.

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
    *   Output: `frontend/build` directory.

*   **Stage 2: Backend Builder**
    *   Base Image: `golang:1.23-alpine`
    *   Action: Copies `backend/` source, runs `go build`.
    *   Output: `main` binary.

*   **Stage 3: Final Runner**
    *   Base Image: `alpine:latest`
    *   Action: 
        *   Copies `main` binary from Stage 2.
        *   Copies `build` assets from Stage 1 to a `./public` directory.
    *   Command: Runs the Go binary.

### 2. Backend Modifications (`backend/main.go`)
The Go server needs to be aware of the frontend assets.
*   **Static File Serving**: Use `http.FileServer` to serve files from the `./public` directory.
*   **SPA Support** (Optional but recommended): Configure the router to serve `index.html` for unknown routes to support React Router client-side navigation.

### 3. Root `package.json`
Acts as the orchestrator for development and docker commands.

*   **`npm run start-docker`**
    *   Builds the docker image: `docker build -t draw-app .`
    *   Runs the container: `docker run -p 8080:8080 draw-app`

*   **`npm run start-local`**
    *   Chained command execution:
        1.  **Build Frontend**: `cd frontend && npm install && npm run build`
        2.  **Prepare Assets**: Copy `frontend/build` to `backend/public` (ensures backend finds files locally).
        3.  **Build Backend**: `cd backend && go build -o main.exe` (or `main` on Linux/Mac).
        4.  **Run**: `cd backend && ./main`

## Directory Structure Changes
```text
draw-app/
├── Dockerfile          # New root Dockerfile
├── package.json        # New root script orchestrator
├── backend/
│   ├── main.go         # Modified to serve ./public
│   └── public/         # (Generated) Static assets live here at runtime
└── frontend/           # Existing React source
```
