package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	// API routes - all API endpoints should use /api prefix
	http.HandleFunc("/api/", handleAPI)

	// Static file server with SPA fallback
	fs := http.FileServer(http.Dir("./public"))
	http.HandleFunc("/", spaHandler(fs))

	port := getPort()
	fmt.Printf("Server starting on port %s...\n", port)
	fmt.Println("API endpoints available at /api/*")
	fmt.Println("Static files served from ./public")

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Error starting server: %s\n", err)
	}
}

// handleAPI handles all API requests with /api prefix
func handleAPI(w http.ResponseWriter, r *http.Request) {
	// Extract the path after /api/
	apiPath := strings.TrimPrefix(r.URL.Path, "/api")

	// Example: simple hello endpoint at /api/ or /api/hello
	if apiPath == "/" || apiPath == "/hello" {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"message":"Hello World from Go Backend!","path":"%s"}`, r.URL.Path)
		return
	}

	if apiPath == "/health" {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status":"active","version":"v1.0"}`)
		return
	}

	// Default 404 for unknown API routes
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprintf(w, `{"error":"API endpoint not found","path":"%s"}`, r.URL.Path)
}

// spaHandler wraps the file server to provide SPA routing support
// It serves static files if they exist, otherwise falls back to index.html
func spaHandler(fs http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Check if the requested path is a file that exists
		path := filepath.Join("./public", r.URL.Path)

		// Try to get file info
		info, err := os.Stat(path)

		// If file exists and is not a directory, serve it
		if err == nil && !info.IsDir() {
			fs.ServeHTTP(w, r)
			return
		}

		// If path is a directory, check for index.html
		if err == nil && info.IsDir() {
			indexPath := filepath.Join(path, "index.html")
			if _, err := os.Stat(indexPath); err == nil {
				fs.ServeHTTP(w, r)
				return
			}
		}

		// For all other cases (including client-side routes), serve index.html
		// This enables React Router to handle the routing
		r.URL.Path = "/"
		fs.ServeHTTP(w, r)
	}
}

// getPort returns the port to listen on, defaulting to 8080
func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return port
}
