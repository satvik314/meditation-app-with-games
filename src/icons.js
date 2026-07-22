// Inline SVG icons — stroke inherits currentColor unless a fill is set.

export const icons = {
  logo: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <circle cx="32" cy="32" r="20" stroke="#1B98E0" stroke-width="3"/>
    <circle cx="32" cy="32" r="11" stroke="#D1495B" stroke-width="3"/>
    <circle cx="32" cy="32" r="3.5" fill="#2A2622"/>
  </svg>`,

  breath: `<svg viewBox="0 0 24 24" fill="none" stroke="#1B98E0" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5"/>
    <circle cx="12" cy="12" r="4"/>
  </svg>`,

  ripple: `<svg viewBox="0 0 24 24" fill="none" stroke="#D1495B" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
    <path d="M3 15c1.8 0 1.8 2 3.6 2s1.8-2 3.6-2 1.8 2 3.6 2 1.8-2 3.6-2"/>
    <path d="M3 10c1.8 0 1.8 2 3.6 2s1.8-2 3.6-2 1.8 2 3.6 2 1.8-2 3.6-2" opacity="0.6"/>
    <circle cx="12" cy="5" r="1.4" fill="#D1495B" stroke="none"/>
  </svg>`,

  focus: `<svg viewBox="0 0 24 24" fill="none" stroke="#0E6BA8" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/>
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/>
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/>
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>
  </svg>`,

  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>`,

  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6"/>
  </svg>`,

  play: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`,

  pause: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>`,

  restart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>
  </svg>`,
};
