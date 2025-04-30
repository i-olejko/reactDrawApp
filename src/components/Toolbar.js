import React from 'react';
import styles from './Toolbar.module.css';

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
  onSelectImage,
  isExpanded,
  setIsExpanded,
  isPinned,
  setIsPinned
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
    <div className={`${styles['toolbar']} ${isExpanded || isPinned ? styles.expanded : styles.collapsed} ${isPinned ? styles.pinned : ''}`}>
      <div className={styles['toolbar-header']}>
        <h3>Toolbar</h3>
        <div className={styles['toolbar-controls']}>
          <button
            className={`${styles['pin-button']} ${isPinned ? styles.active : ''}`}
            onClick={() => setIsPinned(!isPinned)}
            aria-label={isPinned ? 'Unpin toolbar' : 'Pin toolbar'}
          >
            <span role="img" aria-label="Pin">{isPinned ? '📍' : '📌'}</span>
          </button>
          <button
            className={styles['toggle-button']}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse toolbar' : 'Expand toolbar'}
          >
            <span role="img" aria-label="Toggle">{isExpanded ? '⬆️' : '⬇️'}</span>
          </button>
        </div>
      </div>
      {(isExpanded || isPinned) && (
        <div className={styles['toolbar-content']}>
          <div className={styles['tool-section']}>
            <h3>Tools</h3>
            <div className={styles['tool-buttons']}>
              <button
                className={`${styles['tool-button']} ${tool === 'draw' ? styles.active : ''}`}
                onClick={() => setTool('draw')}
              >
                <span role="img" aria-label="Pencil">✏️</span>
                <span>Draw</span>
              </button>
              <button
                className={`${styles['tool-button']} ${tool === 'fill' ? styles.active : ''}`}
                onClick={() => setTool('fill')}
              >
                <span role="img" aria-label="Paint Bucket">🪣</span>
                <span>Fill</span>
              </button>
            </div>
          </div>

          <div className={styles['tool-section']}>
            <h3>Colors</h3>
            <div className={styles['color-picker']}>
              {colorSwatches.map((swatch) => (
                <div
                  key={swatch}
                  className={`${styles['color-swatch']} ${color === swatch ? styles.active : ''}`}
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

          <div className={styles['tool-section']}>
            <h3>Brush Size: {brushSize}px</h3>
            <div className={styles['brush-size-controls']}>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
              />
              <div className={styles['preset-sizes']}>
                {brushSizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles['brush-preset']} ${brushSize === size ? styles.active : ''}`}
                    onClick={() => setBrushSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles['tool-section']}>
            <h3>Actions</h3>
            <div className={styles['action-buttons']}>
              <button onClick={onClear}>
                <span role="img" aria-label="Clear">🧹</span> Clear
              </button>
              <label className={styles['upload-button']}>
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

          <div className={styles['tool-section']}>
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
      )}
    </div>
  );
};

export default Toolbar;