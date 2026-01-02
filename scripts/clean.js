#!/usr/bin/env node

/**
 * Cross-platform script to clean build artifacts
 */

const fs = require('fs');
const path = require('path');

const itemsToClean = [
  'backend/public',
  'backend/main',
  'backend/main.exe',
  'frontend/dist'
];

console.log('Cleaning build artifacts...');

let cleanedCount = 0;

for (const item of itemsToClean) {
  const itemPath = path.join(__dirname, '..', item);

  try {
    if (fs.existsSync(itemPath)) {
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
        console.log(`✓ Removed directory: ${item}`);
      } else {
        fs.unlinkSync(itemPath);
        console.log(`✓ Removed file: ${item}`);
      }

      cleanedCount++;
    }
  } catch (error) {
    console.error(`✗ Failed to remove ${item}:`, error.message);
  }
}

if (cleanedCount === 0) {
  console.log('No build artifacts found to clean.');
} else {
  console.log(`\n✓ Cleaned ${cleanedCount} item(s).`);
}
