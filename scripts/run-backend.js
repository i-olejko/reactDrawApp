#!/usr/bin/env node

/**
 * Cross-platform script to run the backend binary
 * Handles Windows (.exe) vs Unix (no extension) differences
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const backendDir = path.join(__dirname, '..', 'backend');
const isWindows = process.platform === 'win32';
const binaryName = isWindows ? 'main.exe' : 'main';
const binaryPath = path.join(backendDir, binaryName);

// Check if binary exists
if (!fs.existsSync(binaryPath)) {
  console.error(`Error: Backend binary not found: ${binaryPath}`);
  console.error('Please run "npm run build:backend" first.');
  process.exit(1);
}

console.log(`Starting backend server from ${binaryPath}...`);

// Spawn the backend process
const backend = spawn(binaryPath, [], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: isWindows
});

// Handle process exit
backend.on('close', (code) => {
  if (code !== 0) {
    console.error(`Backend process exited with code ${code}`);
    process.exit(code);
  }
});

// Handle errors
backend.on('error', (err) => {
  console.error('Failed to start backend:', err.message);
  process.exit(1);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down backend server...');
  backend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  backend.kill('SIGTERM');
  process.exit(0);
});
