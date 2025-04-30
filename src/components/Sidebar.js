import React, { useState } from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <button className={styles.toggleButton} onClick={toggleSidebar}>
        {isOpen ? '<' : '>'}
      </button>
      <nav className={styles.navigation}>
        <ul>
          <li>
            <button onClick={() => onNavigate('welcome')} className={styles.navButton}>
              Welcome
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('canvas')} className={styles.navButton}>
              Canvas
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;