import React from 'react';

const Welcome = ({ onUploadImage, onStartDrawing }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">🎨 Welcome to Kids Drawing App! 🖌️</h1>
        
        <p className="welcome-text">
          Let's get creative! You can start with a blank canvas or upload your own picture to draw on.
        </p>
        
        <div className="welcome-features">
          <div className="feature">
            <span role="img" aria-label="Pencil" className="feature-icon">✏️</span>
            <h3>Draw</h3>
            <p>Use the pencil tool to draw whatever you imagine!</p>
          </div>
          
          <div className="feature">
            <span role="img" aria-label="Paint Bucket" className="feature-icon">🪣</span>
            <h3>Fill</h3>
            <p>Fill areas with colors using the paint bucket tool!</p>
          </div>
          
          <div className="feature">
            <span role="img" aria-label="Picture" className="feature-icon">🖼️</span>
            <h3>Upload</h3>
            <p>Draw on your own pictures!</p>
          </div>
        </div>
        
        <div className="welcome-actions">
          <button 
            className="start-button"
            onClick={onStartDrawing}
          >
            <span role="img" aria-label="Artist Palette">🎨</span>
            Start with Blank Canvas
          </button>
          
          <p className="or-divider">OR</p>
          
          <label className="upload-button">
            <span role="img" aria-label="Upload">📷</span>
            Upload an Image
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onUploadImage}
            />
          </label>
        </div>
        
        <p className="offline-note">
          <span role="img" aria-label="Star">⭐</span>
          This app works offline! Add it to your home screen for the best experience.
          <span role="img" aria-label="Star">⭐</span>
        </p>
      </div>
    </div>
  );
};

export default Welcome;