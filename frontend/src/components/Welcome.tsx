import React, { useState, useEffect } from 'react';
import './Welcome.css';

interface WelcomeProps {
  onUploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStartDrawing: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onUploadImage, onStartDrawing }) => {
  const [backendVersion, setBackendVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data.status === 'active' && data.version) {
          setBackendVersion(data.version);
        }
      })
      .catch((err) => {
        console.log('Backend not available:', err);
        setBackendVersion(null);
      });
  }, []);

  return (
    <div className="welcome-container">
      {/* Decorative Background Elements */}
      <div className="decoration star-1">⭐</div>
      <div className="decoration star-2">⭐</div>
      <div className="decoration crayon-1">🖍️</div>
      <div className="decoration brush-1">🖌️</div>

      <div className="welcome-card">
        <div className="welcome-header">
          <div className="welcome-title-small">
            <span>🎨</span> Welcome to <span>✏️</span>
          </div>
          <h1 className="welcome-title-large">Kids Drawing App!</h1>
          <p className="welcome-subtitle">Unleash Your Inner Artist!</p>
        </div>

        <div className="features-grid">
          <div className="feature-circle draw">
            <span className="feature-icon">🚀</span>
            <span className="feature-text">Draw</span>
          </div>
          <div className="feature-circle paint">
            <span className="feature-icon">🎨</span>
            <span className="feature-text">Fill</span>
          </div>
          <div className="feature-circle save">
            <span className="feature-icon">☁️</span>
            <span className="feature-text">Upload</span>
          </div>
        </div>

        <div className="action-area">
          <button className="cta-button" onClick={onStartDrawing}>
            Start Drawing Adventures!
          </button>

          <label className="secondary-button">
            <span>📎</span> Upload Your Art
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onUploadImage}
            />
          </label>
        </div>

        <div className="footer-badge">
          {backendVersion ? (
            <span>Connected, BE version: {backendVersion}</span>
          ) : (
            <span>Disconnected</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;