import demosJson from './demos-scraped.json'

export const SCRAPED_DEMOS = demosJson.demos.map(d => ({
  demo_id: d.demo_id,
  ref: d.demo_id.replace('demo', ''),
  source_url: d.source_url,
  title: d.title,
  full_text: d.full_text,
  images: d.images.map(img => ({
    local_path: img.local_path,
    alt: img.alt || '',
  })),
}))

const SECTION_HEADERS = [
  'Demo Description',
  'Scientific Principles',
  'Equipment Location',
  'Equipment',
  'Instructions',
]

export function parseDemoText(fullText) {
  const positions = []

  for (const header of SECTION_HEADERS) {
    const idx = fullText.indexOf(header)
    if (idx !== -1) {
      positions.push({ header, index: idx })
    }
  }

  positions.sort((a, b) => a.index - b.index)

  const runTimeMatch = fullText.match(/Approximate Run Time:\s*(\d+\s*min(?:utes?)?)/i)
  const runTime = runTimeMatch ? runTimeMatch[1].trim() : null

  const sections = {}
  for (let i = 0; i < positions.length; i++) {
    const { header, index } = positions[i]
    const contentStart = index + header.length
    const contentEnd = i + 1 < positions.length ? positions[i + 1].index : fullText.length
    sections[header] = fullText.slice(contentStart, contentEnd).trim()
  }

  return { sections, runTime }
}
