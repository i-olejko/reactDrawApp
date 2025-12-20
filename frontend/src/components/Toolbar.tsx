import React from 'react';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  tool: string;
  setTool: (tool: string) => void;
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onClear: () => void;
  onUploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageList?: string[];
  onSelectImage: (image: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
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
  setIsPinned,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  // Ordered color swatches: First 7 are Rainbow colors (Red, Orange, Yellow, Green, Blue, Indigo/Purple, Violet/Pink)
  // These will be the only ones shown on mobile (via CSS).
  // The rest are available on desktop or via color picker.
  const colorSwatches = [
    '#FF0000', // Red
    '#FFA500', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#EE82EE', // Violet
    '#000000', // Black
    '#FFFFFF', // White
    '#00FFFF', // Cyan
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
            <span className="material-symbols-outlined">{isPinned ? 'keep_public' : 'keep'}</span>
          </button>
          <button
            className={styles['toggle-button']}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse toolbar' : 'Expand toolbar'}
          >
            <span className="material-symbols-outlined">{isExpanded ? 'expand_less' : 'expand_more'}</span>
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
                title="Draw"
              >
                <span className="material-symbols-outlined">edit</span>
                <span className={styles['btn-text']}>Draw</span>
              </button>
              <button
                className={`${styles['tool-button']} ${tool === 'fill' ? styles.active : ''}`}
                onClick={() => setTool('fill')}
                title="Fill"
              >
                <span className="material-symbols-outlined">format_color_fill</span>
                <span className={styles['btn-text']}>Fill</span>
              </button>
            </div>
          </div>

          <div className={styles['tool-section']}>
            <h3>Colors</h3>
            <div className={styles['color-picker']}>
              {colorSwatches.map((swatch, index) => (
                <div
                  key={swatch}
                  className={`${styles['color-swatch']} ${color === swatch ? styles.active : ''} ${index >= 7 ? styles['desktop-only-color'] : ''}`}
                  style={{ backgroundColor: swatch }}
                  onClick={() => setColor(swatch)}
                />
              ))}
              <select
                className={styles['mobile-color-select']}
                onChange={(e) => setColor(e.target.value)}
                value={colorSwatches.slice(7).includes(color) ? color : ''}
              >
                <option value="" disabled>More...</option>
                {colorSwatches.slice(7).map((swatch) => (
                  <option key={swatch} value={swatch}>
                    {swatch}
                  </option>
                ))}
              </select>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={styles['color-input']}
                title="Choose custom color"
              />
            </div>
          </div>

          <div className={styles['tool-section']}>
            <h3>Brush Size: <span className={styles['brush-size-text']}>{brushSize}px</span></h3>
            <div className={styles['brush-size-controls']}>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className={styles['brush-slider']}
              />
              <div className={`${styles['preset-sizes']} ${styles['desktop-only']}`}>
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

          <div className={`${styles['tool-section']} ${styles['actions-section']}`}>
            <h3>Actions</h3>
            <div className={styles['action-buttons']}>
              <button onClick={onUndo} disabled={!canUndo} className={!canUndo ? styles.disabled : ''} title="Undo">
                <span className="material-symbols-outlined">undo</span> <span className={styles['btn-text']}>Undo</span>
              </button>
              <button onClick={onRedo} disabled={!canRedo} className={!canRedo ? styles.disabled : ''} title="Redo">
                <span className="material-symbols-outlined">redo</span> <span className={styles['btn-text']}>Redo</span>
              </button>
              <button onClick={onClear} title="Clear Canvas">
                <span className="material-symbols-outlined">delete</span> <span className={styles['btn-text']}>Clear</span>
              </button>
              <label className={styles['upload-button']} title="Upload Image">
                <span className="material-symbols-outlined">upload</span> <span className={styles['btn-text']}>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={onUploadImage}
                />
              </label>
            </div>
          </div>

          <div className={`${styles['tool-section']} ${styles['desktop-only']}`}>
            <h3>Background</h3>
            <select
              onChange={e => onSelectImage(e.target.value)}
              defaultValue=""
              className={styles['image-select']}
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