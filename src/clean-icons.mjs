// One shared vector family. Existing containers determine the rendered sizes.
const star = '<path d="m24 13 3.4 6.9 7.6 1.1-5.5 5.4 1.3 7.6-6.8-3.6-6.8 3.6 1.3-7.6-5.5-5.4 7.6-1.1z"/>';
const shapes = {
  package:'<path d="m5 13 16-8 16 8-16 8zM5 13v21l16 9V21m0 22 7-4M37 13v12M13 9l16 8"/><circle cx="35" cy="35" r="9"/><path d="m31 35 3 3 5-6"/>',
  banner:'<rect x="9" y="5" width="30" height="5" rx="2"/><path d="M12 10v28m24-28v28"/><rect x="9" y="38" width="30" height="5" rx="2"/>',
  media:'<rect x="5" y="6" width="27" height="26" rx="3"/><rect x="17" y="20" width="26" height="24" rx="3"/><circle cx="13" cy="14" r="2"/><circle cx="24" cy="27" r="2"/><path d="m21 39 7-7 4 4 4-5 5 8"/>',
  social:'<path d="M29 13V7a3 3 0 0 0-3-3H10a3 3 0 0 0-3 3v34a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3v-8M14 9h8m-7 30h6"/><path d="M24 15h17a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-9l-6 5v-5h-2a3 3 0 0 1-3-3V18a3 3 0 0 1 3-3z"/><path d="M33 27c-8-4-5-10 0-6 5-4 8 2 0 6z"/>',
  experience:'<circle cx="19" cy="12" r="8"/><path d="M29 27a16 16 0 0 0-26 12v4h21"/><path d="m34 24 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
  quality:'<circle cx="24" cy="24" r="20"/>'+star,
  strategy:'<circle cx="22" cy="27" r="17"/><circle cx="22" cy="27" r="10"/><path d="m22 27 17-17m-4-1 1-6 4 4 5 1-6 6h-5z"/>',
  idea:'<path d="M17 33c0-5-7-8-7-17a14 14 0 0 1 28 0c0 9-7 12-7 17zM17 38h14m-12 5h10M24 2v-1M4 18H1m43 0h3M7 5l-3-3m37 3 3-3M17 17a7 7 0 0 1 7-7"/>',
  commitment:'<path d="m24 4 17 7v13c0 10-9 17-17 21C16 41 7 34 7 24V11zM16 24l6 6 11-12"/>',
  technology:'<path d="m20 4-1 6-5 2-5-3-5 8 4 4v6l-4 4 5 8 5-3 5 2 1 6h8l1-6 5-2 5 3 5-8-4-4v-6l4-4-5-8-5 3-5-2-1-6z"/><circle cx="24" cy="24" r="8"/>',
  partnership:'<circle cx="24" cy="12" r="7"/><circle cx="8" cy="16" r="5"/><circle cx="40" cy="16" r="5"/><path d="M12 42v-5a12 12 0 0 1 24 0v5zM8 26a7 7 0 0 0-7 7v4h6m33-11a7 7 0 0 1 7 7v4h-6"/>',
  dialogue:'<path d="M31 26a14 14 0 0 0 2-7A14 14 0 1 0 7 26l-2 8 8-3a14 14 0 0 0 10 0"/><path d="M41 34c3-6-1-14-8-14s-11 8-8 14c2 4 7 6 11 4l6 3z"/>',
  planning:'<path d="M26 43H9a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h23a3 3 0 0 1 3 3v16M13 13h15m-15 8h11m-11 8h6"/><path d="m26 34 13-13 5 5-13 13-8 3zM35 25l5 5"/>',
  creation:'<rect x="4" y="5" width="40" height="30" rx="2"/><circle cx="15" cy="14" r="3"/><path d="m8 30 11-10 7 6 7-8 7 12M24 35v8m-9 0h18"/>',
  delivery:'<path d="M18 32C20 15 31 5 44 4c0 14-10 26-25 28zM19 20l-9 1-6 10 12-1m15 0-1 10-10 5 1-12M13 36l-6 7m2-9-4 3m10 3-3 5"/><circle cx="32" cy="16" r="4"/>',
  left:'<path d="m29 10-14 14 14 14"/>',
  right:'<path d="m19 10 14 14-14 14"/>'
};
export function CleanIcon(name, className='clean-icon') {
  return `<svg class="${className}" viewBox="0 0 48 48"${className.includes('process-icon')?' preserveAspectRatio="xMidYMid meet"':''} fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${className.includes('process-icon')?`<g transform="translate(4 4) scale(.833333)">${shapes[name]}</g>`:shapes[name]}</svg>`;
}
