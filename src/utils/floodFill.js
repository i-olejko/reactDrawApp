/**
 * Implements a non-recursive scan-line flood fill algorithm
 * @param {ImageData} imageData - Canvas image data
 * @param {number} startX - X coordinate to start fill
 * @param {number} startY - Y coordinate to start fill
 * @param {Array<number>} fillColor - RGBA color array [r,g,b,a]
 * @param {number} tolerance - Color matching tolerance (0-255)
 */
export function floodFill(imageData, startX, startY, fillColor, tolerance = 0) {
  const { width, height, data } = imageData;
  
  // Get the color of the starting pixel
  const startIdx = (startY * width + startX) * 4;
  const startColor = [
    data[startIdx],
    data[startIdx + 1],
    data[startIdx + 2],
    data[startIdx + 3]
  ];
  
  // If start color and fill color are the same, return
  if (colorsMatch(startColor, fillColor, 0)) {
    return;
  }
  
  // Function to check if a color matches the start color within tolerance
  function matchesStartColor(idx) {
    return colorsMatch(
      [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]],
      startColor,
      tolerance
    );
  }
  
  // Stack for flood fill algorithm
  const stack = [{ x: startX, y: startY }];
  // Track visited pixels
  const visited = new Set();
  const pixelToKey = (x, y) => `${x},${y}`;
  
  while (stack.length) {
    const { x, y } = stack.pop();
    const currentKey = pixelToKey(x, y);
    
    // Skip if out of bounds or already visited
    if (x < 0 || y < 0 || x >= width || y >= height || visited.has(currentKey)) {
      continue;
    }
    
    // Get current pixel index
    const idx = (y * width + x) * 4;
    
    // If it doesn't match the starting color, skip
    if (!matchesStartColor(idx)) {
      continue;
    }
    
    // Mark as visited
    visited.add(currentKey);
    
    // Fill the current pixel
    data[idx] = fillColor[0];
    data[idx + 1] = fillColor[1];
    data[idx + 2] = fillColor[2];
    data[idx + 3] = fillColor[3];
    
    // Add neighboring pixels to stack
    stack.push({ x: x + 1, y });
    stack.push({ x: x - 1, y });
    stack.push({ x, y: y + 1 });
    stack.push({ x, y: y - 1 });
    
    // Optional: Add diagonals for better fill
    // stack.push({ x: x + 1, y: y + 1 });
    // stack.push({ x: x - 1, y: y - 1 });
    // stack.push({ x: x + 1, y: y - 1 });
    // stack.push({ x: x - 1, y: y + 1 });
  }
}

/**
 * Check if two colors match within a tolerance
 * @param {Array<number>} color1 - RGBA color array [r,g,b,a]
 * @param {Array<number>} color2 - RGBA color array [r,g,b,a]
 * @param {number} tolerance - Tolerance for color matching (0-255)
 * @returns {boolean} - True if colors match within tolerance
 */
function colorsMatch(color1, color2, tolerance) {
  return (
    Math.abs(color1[0] - color2[0]) <= tolerance &&
    Math.abs(color1[1] - color2[1]) <= tolerance &&
    Math.abs(color1[2] - color2[2]) <= tolerance &&
    Math.abs(color1[3] - color2[3]) <= tolerance
  );
}