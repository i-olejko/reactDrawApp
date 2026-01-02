# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files first for better layer caching
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM golang:1.23-alpine AS backend-builder

WORKDIR /app/backend

# Install build dependencies
RUN apk add --no-cache git

# Copy go.mod first for better layer caching
COPY backend/go.mod ./
# Uncomment when go.sum exists:
# COPY backend/go.sum ./
# RUN go mod download

# Copy backend source and build
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Stage 3: Final Runtime Image
FROM alpine:latest

# Install runtime dependencies
RUN apk --no-cache add ca-certificates wget

WORKDIR /app

# Copy binary from backend builder
COPY --from=backend-builder /app/backend/main ./

# Copy frontend build artifacts to public directory
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose application port
EXPOSE 8080

# Health check to ensure service is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Run the binary
CMD ["./main"]
