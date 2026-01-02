#!/usr/bin/env node

/**
 * Cross-platform script to copy frontend build artifacts to backend/public
 */

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'frontend', 'dist');
const targetDir = path.join(__dirname, '..', 'backend', 'public');

// Function to recursively copy directory
function copyRecursive(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy directories
      copyRecursive(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main execution
try {
  console.log('Copying frontend build artifacts to backend/public...');

  // Check if source directory exists
  if (!fs.existsSync(sourceDir)) {
    console.error(`Error: Source directory not found: ${sourceDir}`);
    console.error('Please run "npm run build:frontend" first.');
    process.exit(1);
  }

  // Remove target directory if it exists
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  // Copy files
  copyRecursive(sourceDir, targetDir);

  console.log('✓ Successfully copied build artifacts to backend/public');
} catch (error) {
  console.error('Error copying assets:', error.message);
  process.exit(1);
}
