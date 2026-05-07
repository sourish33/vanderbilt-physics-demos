import { useState, useMemo } from 'react'
import { DEMOS } from './data/demos.js'
import { getCatLabel } from './data/categories.js'
import Nav from './components/Nav/Nav.jsx'
import Hero from './components/Hero/Hero.jsx'
import Controls from './components/Controls/Controls.jsx'
import DemoGrid from './components/DemoGrid/DemoGrid.jsx'
import DemoDrawer from './components/DemoDrawer/DemoDrawer.jsx'
import DemoDetailPage from './components/DemoDetailPage/DemoDetailPage.jsx'
import VideoGallery from './components/VideoGallery/VideoGallery.jsx'
import Footer from './components/Footer/Footer.jsx'
import styles from './App.module.css'

export default function App() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('demos')
  const [selectedDemo, setSelectedDemo] = useState(null)
  const [detailDemoId, setDetailDemoId] = useState(null)

  const filteredDemos = useMemo(() => {
    return DEMOS.filter(d => {
      const matchCat = activeFilter === 'all' || d.cat === activeFilter
      const q = query.toLowerCase()
      const matchQ = !q || [d.title, d.desc, d.physics, d.ref, getCatLabel(d.cat)]
        .some(s => s.toLowerCase().includes(q))
      return matchCat && matchQ
    })
  }, [query, activeFilter])

  function handleTabChange(tab) {
    setActiveTab(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleOpenDetail(demoId) {
    setSelectedDemo(null)
    setDetailDemoId(demoId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCloseDetail() {
    setDetailDemoId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (detailDemoId) {
    return (
      <>
        <Nav activeTab={activeTab} onTabChange={handleTabChange} />
        <DemoDetailPage demoId={detailDemoId} onBack={handleCloseDetail} />
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav activeTab={activeTab} onTabChange={handleTabChange} />
      <Hero />

      {activeTab === 'demos' && (
        <Controls
          query={query}
          onQueryChange={setQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      )}

      <main className={styles.main}>
        {activeTab === 'demos' ? (
          <DemoGrid demos={filteredDemos} onSelectDemo={setSelectedDemo} />
        ) : (
          <VideoGallery />
        )}
      </main>

      <DemoDrawer demo={selectedDemo} onClose={() => setSelectedDemo(null)} />
      <Footer />
    </>
  )
}
