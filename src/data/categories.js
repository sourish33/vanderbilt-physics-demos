export const CAT_META = {
  mechanics: { label: 'Mechanics',               color: '#37474F', cssClass: 'cat-mechanics' },
  em:        { label: 'Electricity & Magnetism',  color: '#6A1B9A', cssClass: 'cat-em' },
  waves:     { label: 'Waves & Sound',            color: '#1B5E20', cssClass: 'cat-waves' },
  heat:      { label: 'Heat',                     color: '#B71C1C', cssClass: 'cat-heat' },
  fluids:    { label: 'Fluids & Pressure',        color: '#006064', cssClass: 'cat-fluids' },
  optics:    { label: 'Optics',                   color: '#E65100', cssClass: 'cat-optics' },
  modern:    { label: 'Modern Physics',           color: '#0D47A1', cssClass: 'cat-modern' },
  misc:      { label: 'Miscellaneous',            color: '#4E342E', cssClass: 'cat-misc' },
};

export function getCatLabel(cat) { return CAT_META[cat]?.label ?? cat; }
export function getCatColor(cat)  { return CAT_META[cat]?.color ?? '#777'; }
export function getCatClass(cat)  { return `cat-${cat}`; }
