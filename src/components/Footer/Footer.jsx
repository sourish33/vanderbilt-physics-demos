import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.col}>
          <div className={styles.colBrand}>Vanderbilt University</div>
          <div className={styles.colSub}>Physics Demonstrations</div>
          <p className={styles.colText}>
            A resource for instructors teaching introductory physics at Vanderbilt University.
          </p>
        </div>

        <div className={styles.col}>
          <div className={styles.colHeading}>Resources</div>
          <ul className={styles.colLinks}>
            <li><a href="#">Demo Library</a></li>
            <li><a href="#">Videos</a></li>
            <li>
              <a href="https://as.vanderbilt.edu/physics-astronomy/" target="_blank" rel="noopener noreferrer">
                Dept. Home ↗
              </a>
            </li>
            <li>
              <a href="https://www.vanderbilt.edu/physicsdemonstration/" target="_blank" rel="noopener noreferrer">
                Full Demo Site ↗
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <div className={styles.colHeading}>Contact</div>
          <p className={styles.colText}>
            <strong>Sourish Dutta</strong><br />
            Demo Coordinator<br />
            <a href="mailto:sourish.dutta@vanderbilt.edu">sourish.dutta@vanderbilt.edu</a>
          </p>
          <p className={styles.colText} style={{ marginTop: '10px' }}>
            Department of Physics &amp; Astronomy<br />
            Nashville, Tennessee 37235
          </p>
        </div>
      </div>

      <div className={styles.footerBar}>
        <span>&copy; {new Date().getFullYear()} Vanderbilt University</span>
        <span className={styles.barDot}>·</span>
        <a href="https://www.vanderbilt.edu/about/privacy/" target="_blank" rel="noopener noreferrer">Privacy</a>
        <span className={styles.barDot}>·</span>
        <a href="https://www.vanderbilt.edu/accessibility/" target="_blank" rel="noopener noreferrer">Accessibility</a>
      </div>
    </footer>
  )
}
