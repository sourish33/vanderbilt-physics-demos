import { getCatLabel, getCatColor } from '../../data/categories.js'
import styles from './DemoCard.module.css'

export default function DemoCard({ demo, onSelect }) {
  const color = getCatColor(demo.cat)

  return (
    <div
      className={styles.demoCard}
      onClick={() => onSelect(demo)}
      style={{ '--cat-color': color }}
    >
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <span className={styles.cardRef}>{demo.ref}</span>
          <div className={styles.cardBadges}>
            <span className={styles.catBadge} style={{ backgroundColor: color }}>
              {getCatLabel(demo.cat)}
            </span>
          </div>
        </div>
        <div className={styles.cardTitle}>{demo.title}</div>
        <div className={styles.cardDesc}>{demo.desc}</div>
        <div className={styles.cardPhysics}>
          <strong>Physics</strong>
          {demo.physics}
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.cardTime}>{demo.time}</span>
          <div className={styles.cardArrow}>&#8594;</div>
        </div>
      </div>
    </div>
  )
}
