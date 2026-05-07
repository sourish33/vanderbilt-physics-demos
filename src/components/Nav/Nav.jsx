import styles from './Nav.module.css'

export default function Nav({ activeTab, onTabChange }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <a className={styles.brand} href="#">
          <span className={styles.brandSub}>Vanderbilt University</span>
          <span className={styles.brandMain}>Physics &amp; Astronomy</span>
        </a>
        <div className={styles.links}>
          <button
            className={`${styles.link} ${activeTab === 'demos' ? styles.active : ''}`}
            onClick={() => onTabChange('demos')}
          >
            Demos
          </button>
          <button
            className={`${styles.link} ${activeTab === 'videos' ? styles.active : ''}`}
            onClick={() => onTabChange('videos')}
          >
            Videos
          </button>
          <a
            className={styles.link}
            href="https://as.vanderbilt.edu/physics-astronomy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Course Home ↗
          </a>
        </div>
      </div>
    </nav>
  )
}
