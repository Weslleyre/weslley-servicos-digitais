// Shared geometry, scale and stroke for the four values. No raster assets.
export function ValueIcon(index, label) {
  const drawings = [
    '<path d="M32 8 50 15v16c0 12-8 20-18 25-10-5-18-13-18-25V15Z"/><path d="m23 31 6 6 13-14"/>',
    '<circle cx="30" cy="34" r="21"/><circle cx="30" cy="34" r="13"/><circle cx="30" cy="34" r="5"/><path d="m30 34 23-23m-2-4 1 9 9 1"/>',
    '<circle cx="32" cy="25" r="17"/><path d="m22 39-6 17 12-4 4 6 4-6 12 4-6-17M32 15l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
    '<path d="M23 43c0-5-9-9-9-20a18 18 0 0 1 36 0c0 11-9 15-9 20Zm0 6h18m-15 6h12M32 1V-3M7 10l-4-4m54 4 4-4M4 27H0m60 0h4" transform="translate(0 5) scale(1 .9)"/>'
  ];
  return `<div class="value-icon value-icon-${index}"><svg viewBox="0 0 64 64" role="img" aria-label="${label}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${drawings[index]}</svg></div>`;
}
