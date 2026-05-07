import { CAT_META } from '../../data/categories.js'
import styles from './Controls.module.css'

export default function Controls({ query, onQueryChange, activeFilter, onFilterChange, categories = CAT_META, placeholder }) {
  function getActiveStyle(cat) {
    if (activeFilter !== cat) return {}
    if (cat === 'all') return { backgroundColor: '#1C1C1C', borderColor: '#1C1C1C', color: '#CFAE70' }
    const color = categories[cat]?.color ?? '#777'
    if (cat === 'em') return { backgroundColor: color, borderColor: '#CFAE70', color: '#CFAE70' }
    return { backgroundColor: color, borderColor: color, color: '#fff' }
  }

  return (
    <div className={styles.controls}>
      <div className={styles.controlsInner}>
        <div className={styles.searchWrap}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={placeholder ?? 'Search by title, physics concept, or keyword…'}
            value={query}
            onChange={e => onQueryChange(e.target.value)}
          />
        </div>
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Category:</span>
          <button
            className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.active : ''}`}
            style={getActiveStyle('all')}
            onClick={() => onFilterChange('all')}
          >
            All
          </button>
          {Object.entries(categories).map(([key, meta]) => (
            <button
              key={key}
              className={`${styles.filterBtn} ${activeFilter === key ? styles.active : ''}`}
              style={getActiveStyle(key)}
              onClick={() => onFilterChange(key)}
            >
              {meta.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
