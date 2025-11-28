import React, { useState } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <div className={styles.logoArea}>
          <span className={styles.logoIcon}>🖍️</span>
          {isOpen && <span className={styles.logoText}>Kids Draw</span>}
        </div>
        <button
          className={styles.toggleButton}
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav className={styles.navigation}>
        <ul>
          <li>
            <button onClick={() => onNavigate('welcome')} className={styles.navItem}>
              <span className={styles.navIcon}>🏠</span>
              {isOpen && <span className={styles.navLabel}>Home</span>}
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('canvas')} className={styles.navItem}>
              <span className={styles.navIcon}>🎨</span>
              {isOpen && <span className={styles.navLabel}>Canvas</span>}
            </button>
          </li>
        </ul>
      </nav>

      {isOpen && (
        <div className={styles.footer}>
          <p>© 2025 Fun App</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;