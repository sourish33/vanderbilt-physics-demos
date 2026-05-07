import { useState, useEffect, useMemo } from 'react'
import { VIDEOS } from '../../data/videos.js'
import { CAT_META } from '../../data/categories.js'
import Controls from '../Controls/Controls.jsx'
import styles from './VideoGallery.module.css'

const PAGE_SIZE = 8

// Only the categories that have videos
const VIDEO_CATS = Object.fromEntries(
  Object.keys(VIDEOS)
    .filter(k => CAT_META[k])
    .map(k => [k, CAT_META[k]])
)

// Total video count
const TOTAL = Object.values(VIDEOS).reduce((sum, cat) => sum + cat.items.length, 0)

export default function VideoGallery() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [pages, setPages] = useState({})

  // Reset per-category pages whenever the search or filter changes
  useEffect(() => { setPages({}) }, [query, activeFilter])

  function getPage(key) { return pages[key] ?? 1 }
  function goToPage(key, p) { setPages(prev => ({ ...prev, [key]: p })) }

  const q = query.toLowerCase()

  const filteredSections = useMemo(() => {
    return Object.entries(VIDEOS)
      .filter(([key]) => activeFilter === 'all' || key === activeFilter)
      .map(([key, cat]) => {
        const items = q
          ? cat.items.filter(v =>
              v.title.toLowerCase().includes(q) || v.desc.toLowerCase().includes(q)
            )
          : cat.items
        return { key, cat, items }
      })
      .filter(s => s.items.length > 0)
  }, [query, activeFilter])

  const totalMatches = filteredSections.reduce((n, s) => n + s.items.length, 0)
  const isFiltered = q || activeFilter !== 'all'

  return (
    <>
      <Controls
        query={query}
        onQueryChange={setQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        categories={VIDEO_CATS}
        placeholder="Search by title or description…"
      />

      <div className={styles.videosSection}>
        <div className={styles.resultsInfo}>
          {isFiltered ? (
            <>
              Showing <strong>{totalMatches}</strong> of <strong>{TOTAL}</strong> video{TOTAL !== 1 ? 's' : ''}
              {totalMatches !== TOTAL && (
                <> · <span className={styles.filterNote}>filtered</span></>
              )}
            </>
          ) : (
            <><strong>{TOTAL}</strong> videos across <strong>{Object.keys(VIDEOS).length}</strong> subject areas</>
          )}
        </div>

        {filteredSections.length === 0 ? (
          <div className={styles.noResults}>
            <strong>No videos found</strong>
            <p>Try a different search term or clear the category filter.</p>
          </div>
        ) : (
          filteredSections.map(({ key, cat, items }) => {
            const page = getPage(key)
            const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
            const start = (page - 1) * PAGE_SIZE
            const pageItems = items.slice(start, start + PAGE_SIZE)
            const catColor = cat.color

            return (
              <div key={key} className={styles.videoCatSection}>
                <div className={styles.videoCatHeader}>
                  <span className={styles.videoCatDot} style={{ backgroundColor: catColor }} />
                  <span className={styles.videoCatLabel}>{cat.label}</span>
                  <span className={styles.videoCatCount}>{items.length} video{items.length !== 1 ? 's' : ''}</span>
                </div>

                <div className={styles.videoList}>
                  {pageItems.map((video, i) => (
                    <a
                      key={i}
                      className={styles.videoItem}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ '--cat-color': catColor }}
                    >
                      <div className={styles.videoIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" />
                          <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                        </svg>
                      </div>
                      <div className={styles.videoInfo}>
                        <div className={styles.videoTitle}>{video.title}</div>
                        <div className={styles.videoDesc}>{video.desc}</div>
                      </div>
                      <div className={styles.videoArrow}>→</div>
                    </a>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.pageBtn}
                      onClick={() => goToPage(key, page - 1)}
                      disabled={page === 1}
                    >
                      ← Prev
                    </button>
                    <span className={styles.pageInfo}>
                      {start + 1}–{Math.min(start + PAGE_SIZE, items.length)} of {items.length}
                    </span>
                    <button
                      className={styles.pageBtn}
                      onClick={() => goToPage(key, page + 1)}
                      disabled={page === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
