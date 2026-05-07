# Physics Demonstrations — React/Vite Conversion

## Project Overview

Convert the existing single-file HTML site (`physics-demos.html`) into a React application using Vite. The site is a searchable library of Vanderbilt University physics demonstrations. All demo and video data is already embedded in the HTML file — do not change or lose any of it during the conversion.

---

## Stack

- **Vite** with the React template (`npm create vite@latest . -- --template react`)
- **CSS Modules** for component-scoped styles (`.module.css` per component)
- **Framer Motion** for the drawer slide-in and card animations (`npm install framer-motion`)
- No UI component libraries (no MUI, no Bootstrap, no shadcn). All styling is hand-written CSS.

---

## Project Structure

Organize the project as follows:

```
src/
  main.jsx
  App.jsx
  App.module.css
  styles/
    tokens.css          # global CSS variables and resets
    typography.css      # @import for Google Fonts + base font rules
  data/
    demos.js            # DEMOS array
    videos.js           # VIDEOS object
    categories.js       # CAT_META object
  components/
    Nav/
      Nav.jsx
      Nav.module.css
    Hero/
      Hero.jsx
      Hero.module.css
    Controls/
      Controls.jsx
      Controls.module.css
    DemoGrid/
      DemoGrid.jsx
      DemoGrid.module.css
    DemoCard/
      DemoCard.jsx
      DemoCard.module.css
    DemoDrawer/
      DemoDrawer.jsx
      DemoDrawer.module.css
    VideoGallery/
      VideoGallery.jsx
      VideoGallery.module.css
    Footer/
      Footer.jsx
      Footer.module.css
```

---

## Global Styles

### `src/styles/tokens.css`

Extract all CSS custom properties from the HTML file's `:root` block verbatim into this file. Also include the `*, *::before, *::after` reset and the `body` base styles. Import this file once at the top of `main.jsx`.

```css
/* Example — copy exact values from the HTML source */
:root {
  --vu-black:      #1C1C1C;
  --vu-gold:       #CFAE70;
  --vu-gold-dark:  #946E24;
  --vu-gold-light: #ECB748;
  --vu-cream:      #F5F3EF;
  --vu-sand:       #E0D5C0;
  --vu-gray-dark:  #777777;
  --vu-gray-light: #E4E4E4;
  --vu-sky:        #B3C9CD;
  --vu-sage:       #8BA18E;
  --vu-white:      #FFFFFF;
  --gold-grad: linear-gradient(135deg, #FEEEB6 0%, #CFAE70 45%, #B49248 100%);

  --cat-mechanics: #7A5209;
  --cat-em:        #1C1C1C;
  --cat-waves:     #4A6B57;
  --cat-heat:      #B85C00;
  --cat-fluids:    #3A6E7A;
  --cat-optics:    #5C4A00;
  --cat-modern:    #4A4A4A;
  --cat-misc:      #6B5A3A;

  --radius: 6px;
  --shadow: 0 2px 12px rgba(28,28,28,0.10);
  --shadow-hover: 0 8px 28px rgba(28,28,28,0.18);
  --transition: 0.22s cubic-bezier(0.4,0,0.2,1);
}
```

### `src/styles/typography.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Antonio:wght@400;500;700&display=swap');
```

Import this file once in `main.jsx` after `tokens.css`.

---

## Data Files

### `src/data/categories.js`

Export the `CAT_META` object from the HTML file as a named export:

```js
export const CAT_META = { ... };
```

Add two helper functions in the same file:

```js
export function getCatLabel(cat) { return CAT_META[cat]?.label ?? cat; }
export function getCatColor(cat)  { return CAT_META[cat]?.color ?? '#777'; }
export function getCatClass(cat)  { return `cat-${cat}`; }
```

### `src/data/demos.js`

Export the full `DEMOS` array as a named export. Copy it verbatim from the HTML file — every object, every field, nothing omitted.

```js
export const DEMOS = [ ... ];
```

### `src/data/videos.js`

Export the full `VIDEOS` object as a named export. Copy it verbatim.

```js
export const VIDEOS = { ... };
```

---

## State Management

Use React's built-in hooks only — no Redux, no Zustand, no Context API needed for this scale.

All filtering/search state lives in `App.jsx`:

```jsx
const [query, setQuery]               = useState('');
const [activeFilter, setActiveFilter] = useState('all');
const [activeTab, setActiveTab]       = useState('demos');   // 'demos' | 'videos'
const [selectedDemo, setSelectedDemo] = useState(null);      // demo object or null
```

Derive the filtered list with `useMemo`:

```jsx
const filteredDemos = useMemo(() => {
  return DEMOS.filter(d => {
    const matchCat = activeFilter === 'all' || d.cat === activeFilter;
    const q = query.toLowerCase();
    const matchQ = !q || [d.title, d.desc, d.physics, d.ref, getCatLabel(d.cat)]
      .some(s => s.toLowerCase().includes(q));
    return matchCat && matchQ;
  });
}, [query, activeFilter]);
```

Pass `setSelectedDemo` down to `DemoCard`. Pass `selectedDemo` and a `onClose` callback to `DemoDrawer`.

---

## Component Specifications

### `App.jsx`

The root component. Renders:
1. `<Nav />`
2. `<Hero />`
3. A tab bar (inline, not its own component — it is simple enough)
4. `<Controls />` — only rendered when `activeTab === 'demos'`
5. Conditionally: `<DemoGrid />` or `<VideoGallery />`
6. `<DemoDrawer />` — always in the tree; Framer Motion handles its visibility
7. `<Footer />`

### `Nav.jsx`

Stateless. Receives an `onTabChange` prop for the two nav link buttons ("Demo Library", "Videos"). Mark the active tab with an `active` CSS Module class. The department homepage link (`https://as.vanderbilt.edu/physics-astronomy/`) opens in a new tab.

### `Hero.jsx`

Stateless. Pure presentation. The gold-gradient text on the `h1` is done with the CSS background-clip technique — keep it in `Hero.module.css`, not inline styles. The contact card with Sourish Dutta's info is part of this component.

### `Controls.jsx`

Receives: `query`, `onQueryChange`, `activeFilter`, `onFilterChange`.

Renders the search input and the row of category filter pill buttons. The filter buttons are generated by mapping over `Object.keys(CAT_META)`, prepended by an "All" button. Apply the correct active styling by comparing each button's key to `activeFilter`.

### `DemoGrid.jsx`

Receives: `demos` (the filtered array), `onSelectDemo`.

Renders the results count line and the card grid. If `demos.length === 0`, render the empty state. Map over `demos` to render a `<DemoCard />` for each.

Use Framer Motion's `AnimatePresence` and `motion.div` on the grid container so cards animate in on filter/search changes:

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Each card:
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
```

The `layout` prop on each card makes the grid reflow animate smoothly when items are added or removed.

### `DemoCard.jsx`

Receives: `demo`, `onSelect`.

Stateless. Renders the colored accent bar, ref number, category badge, title, description, physics box, run time, and arrow button. The colored accent bar and category badge get their color from `getCatColor(demo.cat)` applied as an inline style (since the color values are dynamic at runtime, not static class names). Everything else uses CSS Modules.

### `DemoDrawer.jsx`

Receives: `demo` (null when closed), `onClose`.

This is the most important component for Framer Motion. Use `AnimatePresence` and `motion.div` for both the overlay and the panel:

```jsx
import { AnimatePresence, motion } from 'framer-motion';

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
        {/* header, body, actions */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

Add a `useEffect` that sets `document.body.style.overflow` to `'hidden'` when `demo` is truthy and restores it on cleanup:

```jsx
useEffect(() => {
  if (demo) document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = ''; };
}, [demo]);
```

Also add a `useEffect` for the Escape key:

```jsx
useEffect(() => {
  const handler = (e) => { if (e.key === 'Escape') onClose(); };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [onClose]);
```

The "View Full Write-Up" button links to `demo.url`. The "Request This Demo" button is a `mailto:` link pre-filled with Sourish Dutta's address and the demo title as the subject.

### `VideoGallery.jsx`

Receives no props. Reads directly from the `VIDEOS` import.

Maps over `Object.entries(VIDEOS)` to render each category section. Each video item is an `<a>` tag with `target="_blank" rel="noopener"`. Keep the play icon, title, description, and chevron layout from the original HTML.

### `Footer.jsx`

Stateless. Contains the copyright line and the link to the Physics & Astronomy department homepage.

---

## CSS Modules Notes

- Move all styles from the HTML's `<style>` block into the appropriate `.module.css` files.
- For dynamic colors (category accent bars, badge backgrounds), use inline `style={{ backgroundColor: getCatColor(demo.cat) }}` rather than trying to generate dynamic class names.
- The `cat-mechanics`, `cat-em`, etc. classes that appear on multiple elements (accent bar, badge) can be defined as regular global classes in `tokens.css` and applied via `className` rather than CSS Modules — this is one of the few cases where a global class is cleaner than a module.
- The sticky `Controls` bar (`position: sticky; top: 60px`) must account for the nav height. If the nav height ever changes, update the `top` value accordingly.
- The `hero::after` gold gradient bar at the bottom of the hero is a CSS pseudo-element — keep it in `Hero.module.css` using `:global` or by making the hero a regular class if pseudo-elements cause issues with CSS Modules.

---

## `vite.config.js`

No special configuration needed beyond the default React template output. CSS Modules work out of the box in Vite for any file named `*.module.css`.

---

## Checklist

- [ ] All 160+ demos from the `DEMOS` array are present and unmodified
- [ ] All 70+ videos from the `VIDEOS` object are present and unmodified
- [ ] Search filters correctly on title, description, physics concepts, and ref number
- [ ] Category filter pills update the displayed demos
- [ ] Clicking a demo card opens the drawer with correct data
- [ ] Escape key and overlay click both close the drawer
- [ ] Drawer slide animation uses Framer Motion spring physics
- [ ] Card grid reflows animate when search/filter changes
- [ ] Body scroll is locked when the drawer is open
- [ ] "View Full Write-Up" links open in a new tab
- [ ] "Request This Demo" generates a correctly pre-filled mailto link
- [ ] Tab switching between Demo Library and Videos works
- [ ] Nav is sticky at `top: 0`; Controls bar is sticky at `top: 60px`
- [ ] Google Fonts load correctly (Libre Caslon Text, Inter, Antonio)
- [ ] All CSS custom properties from `tokens.css` are used consistently
- [ ] No MUI, Bootstrap, or other UI library is installed
- [ ] `npm run build` completes without errors