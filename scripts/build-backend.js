#!/usr/bin/env node

/**
 * Cross-platform script to build the Go backend
 * Handles Windows (.exe) vs Unix (no extension) differences
 */

const { execSync } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, '..', 'backend');
const isWindows = process.platform === 'win32';
const binaryName = isWindows ? 'main.exe' : 'main';

console.log(`Building backend for ${process.platform}...`);
console.log(`Output: ${binaryName}`);

try {
  execSync(`go build -o ${binaryName} .`, {
    cwd: backendDir,
    stdio: 'inherit'
  });
  console.log(`✓ Backend built successfully: backend/${binaryName}`);
} catch (error) {
  console.error('✗ Backend build failed');
  process.exit(1);
}
