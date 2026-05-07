import { useState } from 'react'
import { SCRAPED_DEMOS, parseDemoText } from '../../data/scrapedDemos.js'
import { DEMOS } from '../../data/demos.js'
import { getCatLabel, getCatColor } from '../../data/categories.js'
import styles from './DemoDetailPage.module.css'

const SECTION_ORDER = [
  'Demo Description',
  'Scientific Principles',
  'Equipment',
  'Equipment Location',
  'Instructions',
]

const SECTION_ICONS = {
  'Demo Description': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  'Scientific Principles': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
    </svg>
  ),
  'Equipment': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  'Equipment Location': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  'Instructions': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
}

function splitEquipmentItems(text) {
  // Equipment text is typically a newline or space-separated list of items
  return text
    .split(/\n|(?<=[a-z0-9)])(?=[A-Z])/)
    .map(s => s.trim())
    .filter(Boolean)
}

export default function DemoDetailPage({ demoId, onBack }) {
  const [lightboxImg, setLightboxImg] = useState(null)

  const scraped = SCRAPED_DEMOS.find(d => d.demo_id === demoId)
  const demo = DEMOS.find(d => d.ref === scraped?.ref)

  if (!scraped) return null

  const { sections, runTime } = parseDemoText(scraped.full_text)
  const color = demo ? getCatColor(demo.cat) : 'var(--vu-gold-dark)'
  const catLabel = demo ? getCatLabel(demo.cat) : 'Mechanics'

  return (
    <div className={styles.page}>
      {/* Sticky header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Demos
        </button>
        <div className={styles.headerMeta}>
          <span className={styles.eyebrow}>
            <span className={styles.catDot} style={{ backgroundColor: color }} />
            {catLabel} &nbsp;·&nbsp; Demo #{scraped.ref}
          </span>
          {(runTime || demo?.time) && (
            <span className={styles.runTime}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {runTime || demo.time}
            </span>
          )}
        </div>
        <h1 className={styles.title}>{scraped.title}</h1>
      </div>

      <div className={styles.content}>
        {/* Image gallery */}
        {scraped.images.length > 0 && (
          <div className={`${styles.gallery} ${scraped.images.length === 1 ? styles.gallerySingle : ''}`}>
            {scraped.images.map((img, i) => (
              <button
                key={i}
                className={styles.galleryItem}
                onClick={() => setLightboxImg(img)}
                title="Click to enlarge"
              >
                <img src={`/${img.local_path}`} alt={img.alt || `Demo ${scraped.ref} image ${i + 1}`} />
                <div className={styles.galleryOverlay}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Sections */}
        <div className={styles.sections}>
          {SECTION_ORDER.map(header => {
            const text = sections[header]
            if (!text) return null

            const isEquipment = header === 'Equipment'
            const items = isEquipment ? splitEquipmentItems(text) : null

            return (
              <div key={header} className={styles.section}>
                <div className={styles.sectionLabel}>
                  <span className={styles.sectionIcon} style={{ color }}>
                    {SECTION_ICONS[header]}
                  </span>
                  {header}
                </div>
                {isEquipment && items && items.length > 1 ? (
                  <ul className={styles.equipmentList}>
                    {items.map((item, i) => (
                      <li key={i} className={styles.equipmentItem}>
                        <span className={styles.bullet} style={{ backgroundColor: color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.sectionBody}>{text}</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer actions */}
        <div className={styles.actions}>
          <a
            className={`${styles.btn} ${styles.btnPrimary}`}
            href={scraped.source_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View Original Write-Up
          </a>
          <a
            className={`${styles.btn} ${styles.btnSecondary}`}
            href={`mailto:sourish.dutta@vanderbilt.edu?subject=Demo Request: ${encodeURIComponent(scraped.title)}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Request This Demo
          </a>
        </div>

        <p className={styles.credit}>
          Write-up by David A. Burba &mdash; Vanderbilt University Department of Physics &amp; Astronomy
        </p>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div className={styles.lightbox} onClick={() => setLightboxImg(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightboxImg(null)}>&times;</button>
          <img
            src={`/${lightboxImg.local_path}`}
            alt={lightboxImg.alt}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
