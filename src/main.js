import './style.css';
import { icons } from './icons.js';
import { mountBreathing } from './games/breathing.js';
import { mountRipple } from './games/ripple.js';
import { mountFocus } from './games/focus.js';

const GAMES = {
  breathing: {
    title: 'Guided Breath',
    kicker: 'Regulate',
    sub: 'Box & 4-7-8 breathing',
    blurb:
      'An orb that swells and settles with your breath. Sync to it for a minute and your nervous system follows — the fastest way back to a clear head.',
    accent: 'blue',
    icon: icons.breath,
    mount: mountBreathing,
  },
  ripple: {
    title: 'Ripple Pond',
    kicker: 'Ground',
    sub: 'Tap the water',
    blurb:
      'Tap anywhere to send ripples across still water and release drifting light. No score, no losing — a place to slow your hands before you dive back in.',
    accent: 'red',
    icon: icons.ripple,
    mount: mountRipple,
  },
  focus: {
    title: 'Focus Flow',
    kicker: 'Sharpen',
    sub: 'Memory & attention',
    blurb:
      'Watch a sequence of glowing tiles, then echo it back. Each round adds a step, drawing scattered attention into a single, quiet point of focus.',
    accent: 'blue',
    icon: icons.focus,
    mount: mountFocus,
  },
};

const ACCENTS = {
  blue: { color: 'var(--blue-dark)', iconBg: 'rgba(27,152,224,0.12)', glow: 'radial-gradient(120% 90% at 100% 0%, rgba(27,152,224,0.14), transparent 55%)' },
  red: { color: 'var(--red)', iconBg: 'rgba(209,73,91,0.12)', glow: 'radial-gradient(120% 90% at 100% 0%, rgba(209,73,91,0.14), transparent 55%)' },
};

const app = document.getElementById('app');
let cleanup = null;

function runCleanup() {
  if (typeof cleanup === 'function') cleanup();
  cleanup = null;
}

function topbar() {
  return `
    <header class="topbar">
      <button class="brand" data-nav="home" aria-label="Still — home">
        <span class="mark">${icons.logo}</span>
        <span>Still<em>.</em></span>
      </button>
      <span class="tagline">A pause between tasks</span>
    </header>
  `;
}

function footer() {
  return `
    <footer class="footer">
      Built to bring you back ·
      <span class="swatches">
        <span class="sw" style="background:var(--beige-300)" title="Beige"></span>
        <span class="sw" style="background:var(--red)" title="Red"></span>
        <span class="sw" style="background:var(--blue)" title="Techno Blue"></span>
      </span>
      · then close the tab and begin.
    </footer>
  `;
}

function renderHome() {
  runCleanup();
  const cards = Object.entries(GAMES)
    .map(([id, g]) => {
      const a = ACCENTS[g.accent];
      return `
        <button class="card" data-nav="${id}" style="--accent:${a.color};--icon-bg:${a.iconBg};--card-glow:${a.glow}">
          <span class="icon">${g.icon}</span>
          <div class="kicker">${g.kicker}</div>
          <h3>${g.title}</h3>
          <p>${g.blurb}</p>
          <span class="go">Enter ${icons.arrow}</span>
        </button>
      `;
    })
    .join('');

  app.innerHTML = `
    ${topbar()}
    <main class="view">
      <section class="hero">
        <span class="eyebrow"><span class="dot"></span> Reset in one minute</span>
        <h1>Lost your focus?<br /><em>Breathe</em>, play, <span class="blue">return.</span></h1>
        <p class="lede">
          Three tiny mindful games for the moment your attention drifts.
          Pick one, spend sixty unhurried seconds, and slip back into the task with a settled mind.
        </p>
      </section>
      <section class="grid">${cards}</section>
    </main>
    ${footer()}
  `;
}

function renderGame(id) {
  const g = GAMES[id];
  if (!g) return renderHome();
  runCleanup();
  const a = ACCENTS[g.accent];

  app.innerHTML = `
    ${topbar()}
    <main class="view">
      <div class="game-head">
        <button class="back-btn" data-nav="home">${icons.back} All games</button>
        <div class="stat-row">
          <button class="btn btn-ghost" data-nav="home">Done · take it with you</button>
        </div>
      </div>
      <div class="game-title" style="margin-bottom:20px">
        <span class="icon" style="--icon-bg:${a.iconBg}">${g.icon}</span>
        <div>
          <h2>${g.title}</h2>
          <div class="sub">${g.sub}</div>
        </div>
      </div>
      <div class="stage" id="stage"></div>
    </main>
    ${footer()}
  `;

  const stage = app.querySelector('#stage');
  cleanup = g.mount(stage);
}

function navigate(route) {
  if (route === 'home' || !route) {
    location.hash = '';
    renderHome();
  } else {
    location.hash = `#/${route}`;
    renderGame(route);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delegate all navigation clicks
app.addEventListener('click', (e) => {
  const el = e.target.closest('[data-nav]');
  if (!el) return;
  navigate(el.dataset.nav);
});

// Support deep links / back button
function routeFromHash() {
  const m = location.hash.match(/^#\/(\w+)$/);
  if (m && GAMES[m[1]]) renderGame(m[1]);
  else renderHome();
}

window.addEventListener('hashchange', routeFromHash);

routeFromHash();
