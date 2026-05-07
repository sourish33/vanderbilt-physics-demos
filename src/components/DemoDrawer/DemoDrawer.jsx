import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getCatLabel, getCatColor } from '../../data/categories.js'
import styles from './DemoDrawer.module.css'

export default function DemoDrawer({ demo, onClose }) {
  useEffect(() => {
    if (demo) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [demo])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {demo && (
        <>
          <motion.div
            className={styles.overlay}
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.panel}
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className={styles.header}>
              <button className={styles.closeBtn} onClick={onClose} title="Close">&times;</button>
              <div className={styles.eyebrow}>
                {getCatLabel(demo.cat)} &nbsp;·&nbsp; Demo #{demo.ref}
              </div>
              <h2 className={styles.title}>{demo.title}</h2>
            </div>

            <div className={styles.body}>
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Category</div>
                  <div className={styles.metaValue} style={{ color: getCatColor(demo.cat) }}>
                    {getCatLabel(demo.cat)}
                  </div>
                </div>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Approx. Run Time</div>
                  <div className={styles.metaValue}>{demo.time}</div>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionLabel}>Description</div>
                <p>{demo.desc}</p>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionLabel}>Physics Concepts</div>
                <p>{demo.physics}</p>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionLabel}>Access Demo</div>
                <div className={styles.actions}>
                  <a
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    href={demo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    View Full Write-Up &amp; Instructions
                  </a>
                  <a
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    href={`mailto:sourish.dutta@vanderbilt.edu?subject=Demo Request: ${encodeURIComponent(demo.title)}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Request This Demo
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
