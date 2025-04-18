import React from 'react';

const Toolbar = ({ 
  tool, 
  setTool, 
  color, 
  setColor, 
  brushSize, 
  setBrushSize,
  onClear,
  onUploadImage,
  imageList = [],
  onSelectImage
}) => {
  // Predefined color swatches
  const colorSwatches = [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#A52A2A', // Brown
    '#FFC0CB', // Pink
  ];

  // Predefined brush sizes
  const brushSizes = [5, 10, 15, 20, 25];

  return (
    <div className="toolbar">
      <div className="tool-section">
        <h3>Tools</h3>
        <div className="tool-buttons">
          <button 
            className={`tool-button ${tool === 'draw' ? 'active' : ''}`}
            onClick={() => setTool('draw')}
          >
            <span role="img" aria-label="Pencil">✏️</span>
            <span>Draw</span>
          </button>
          <button 
            className={`tool-button ${tool === 'fill' ? 'active' : ''}`}
            onClick={() => setTool('fill')}
          >
            <span role="img" aria-label="Paint Bucket">🪣</span>
            <span>Fill</span>
          </button>
        </div>
      </div>

      <div className="tool-section">
        <h3>Colors</h3>
        <div className="color-picker">
          {colorSwatches.map((swatch) => (
            <div
              key={swatch}
              className={`color-swatch ${color === swatch ? 'active' : ''}`}
              style={{ backgroundColor: swatch }}
              onClick={() => setColor(swatch)}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
      </div>

      <div className="tool-section">
        <h3>Brush Size: {brushSize}px</h3>
        <div className="brush-size-controls">
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
          <div className="preset-sizes">
            {brushSizes.map((size) => (
              <button
                key={size}
                className={`brush-preset ${brushSize === size ? 'active' : ''}`}
                onClick={() => setBrushSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tool-section">
        <h3>Actions</h3>
        <div className="action-buttons">
          <button onClick={onClear}>
            <span role="img" aria-label="Clear">🧹</span> Clear
          </button>
          <label className="upload-button">
            <span role="img" aria-label="Upload">📷</span> Upload
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onUploadImage}
            />
          </label>
        </div>
      </div>

      <div className="tool-section">
        <h3>Background Image</h3>
        <select
          onChange={e => onSelectImage(e.target.value)}
          defaultValue=""
        >
          <option value="">None</option>
          {imageList.map(img => (
            <option key={img} value={img}>{img}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Toolbar;