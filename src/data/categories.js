export const CAT_META = {
  mechanics: { label: 'Mechanics',               color: '#7A5209', cssClass: 'cat-mechanics' },
  em:        { label: 'Electricity & Magnetism',  color: '#1C1C1C', cssClass: 'cat-em' },
  waves:     { label: 'Waves & Sound',            color: '#4A6B57', cssClass: 'cat-waves' },
  heat:      { label: 'Heat',                     color: '#B85C00', cssClass: 'cat-heat' },
  fluids:    { label: 'Fluids & Pressure',        color: '#3A6E7A', cssClass: 'cat-fluids' },
  optics:    { label: 'Optics',                   color: '#5C4A00', cssClass: 'cat-optics' },
  modern:    { label: 'Modern Physics',           color: '#4A4A4A', cssClass: 'cat-modern' },
  misc:      { label: 'Miscellaneous',            color: '#6B5A3A', cssClass: 'cat-misc' },
};

export function getCatLabel(cat) { return CAT_META[cat]?.label ?? cat; }
export function getCatColor(cat)  { return CAT_META[cat]?.color ?? '#777'; }
export function getCatClass(cat)  { return `cat-${cat}`; }
