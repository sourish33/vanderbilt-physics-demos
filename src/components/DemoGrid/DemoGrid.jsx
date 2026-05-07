import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEMOS } from '../../data/demos.js'
import DemoCard from '../DemoCard/DemoCard.jsx'
import styles from './DemoGrid.module.css'

const PAGE_SIZE = 12

function pageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, current, current - 1, current + 1])
  return [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b)
}

export default function DemoGrid({ demos, onSelectDemo }) {
  const [page, setPage] = useState(1)
  const topRef = useRef(null)

  useEffect(() => { setPage(1) }, [demos])

  const totalPages = Math.max(1, Math.ceil(demos.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const pageDemos = demos.slice(start, start + PAGE_SIZE)

  function goToPage(p) {
    setPage(p)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const visiblePages = pageRange(page, totalPages)

  return (
    <div className={styles.gridSection} ref={topRef}>
      <p className={styles.resultsInfo}>
        {demos.length === 0 ? (
          <>Showing <strong>0</strong> of <strong>{DEMOS.length}</strong> demonstrations</>
        ) : (
          <>
            Showing <strong>{start + 1}–{Math.min(start + PAGE_SIZE, demos.length)}</strong> of{' '}
            <strong>{demos.length}</strong> demonstration{demos.length !== 1 ? 's' : ''}
            {demos.length !== DEMOS.length && (
              <> · <span className={styles.filterNote}>filtered from {DEMOS.length} total</span></>
            )}
          </>
        )}
      </p>
      <div className={styles.demoGrid}>
        <AnimatePresence>
          {pageDemos.length === 0 ? (
            <div className={styles.noResults}>
              <strong>No results found</strong>
              <p>Try a different search term or clear the category filter.</p>
            </div>
          ) : (
            pageDemos.map(demo => (
              <motion.div
                key={demo.ref}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <DemoCard demo={demo} onSelect={onSelectDemo} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <div className={styles.pageNumbers}>
            {visiblePages.map((n, i) => {
              const prev = visiblePages[i - 1]
              return (
                <span key={n} className={styles.pageNumWrap}>
                  {prev && n - prev > 1 && <span className={styles.ellipsis}>…</span>}
                  <button
                    className={`${styles.pageNum} ${n === page ? styles.pageNumActive : ''}`}
                    onClick={() => goToPage(n)}
                  >
                    {n}
                  </button>
                </span>
              )
            })}
          </div>
          <button
            className={styles.pageBtn}
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
