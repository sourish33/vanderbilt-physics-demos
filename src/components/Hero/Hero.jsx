import { DEMOS } from '../../data/demos.js'
import { CAT_META } from '../../data/categories.js'
import styles from './Hero.module.css'

export default function Hero() {
  const demoCount = DEMOS.length
  const catCount = Object.keys(CAT_META).length

  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <div>
          <div className={styles.heroEyebrow}>Department of Physics &amp; Astronomy</div>
          <h1 className={styles.heroTitle}>Physics Demonstrations</h1>
          <p className={styles.heroSubtitle}>
            A searchable library of lecture demonstrations for Vanderbilt University physics courses,
            spanning mechanics, electromagnetism, optics, thermodynamics, and modern physics.
          </p>
        </div>
        <div className={styles.heroContact}>
          <div className={styles.heroContactLabel}>Demo Support &amp; Requests</div>
          <p>
            Contact <strong>Sourish Dutta</strong><br />
            <a href="mailto:sourish.dutta@vanderbilt.edu">sourish.dutta@vanderbilt.edu</a><br /><br />
            Please allow at least <strong>24 hours</strong> notice for demo setup or video requests.
          </p>
        </div>
      </div>

      <div className={styles.statStrip}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{demoCount}</span>
          <span className={styles.statLabel}>Demonstrations</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>{catCount}</span>
          <span className={styles.statLabel}>Subject Areas</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>All</span>
          <span className={styles.statLabel}>Introductory Courses</span>
        </div>
      </div>
    </div>
  )
}
