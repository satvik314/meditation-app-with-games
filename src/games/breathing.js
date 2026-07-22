import { icons } from '../icons.js';

// Guided breathing — an orb that grows on the inhale and shrinks on the exhale.
// Two patterns: Box breathing (4-4-4-4) and Calming breath (4-7-8).

const PATTERNS = {
  box: {
    label: 'Box · 4-4-4-4',
    phases: [
      { name: 'Breathe in', key: 'in', dur: 4 },
      { name: 'Hold', key: 'hold', dur: 4 },
      { name: 'Breathe out', key: 'out', dur: 4 },
      { name: 'Hold', key: 'hold', dur: 4 },
    ],
  },
  calm: {
    label: 'Calm · 4-7-8',
    phases: [
      { name: 'Breathe in', key: 'in', dur: 4 },
      { name: 'Hold', key: 'hold', dur: 7 },
      { name: 'Breathe out', key: 'out', dur: 8 },
    ],
  },
};

export function mountBreathing(root) {
  root.innerHTML = `
    <div class="breath-wrap">
      <div class="breath-orb">
        <div class="ring"></div>
        <div class="halo" id="halo"></div>
        <div class="core" id="core"></div>
      </div>
      <div>
        <div class="breath-phase" id="phase">Ready when you are</div>
        <div class="breath-count" id="count">Follow the orb · let your shoulders drop</div>
      </div>
      <div class="chip-row" id="patterns">
        <button class="chip" data-p="box" aria-pressed="true">${PATTERNS.box.label}</button>
        <button class="chip" data-p="calm" aria-pressed="false">${PATTERNS.calm.label}</button>
      </div>
      <div class="breath-controls">
        <button class="btn btn-primary" id="toggle">${icons.play}<span>Begin</span></button>
      </div>
    </div>
  `;

  const core = root.querySelector('#core');
  const halo = root.querySelector('#halo');
  const phaseEl = root.querySelector('#phase');
  const countEl = root.querySelector('#count');
  const toggleBtn = root.querySelector('#toggle');
  const patternWrap = root.querySelector('#patterns');

  let patternKey = 'box';
  let running = false;
  let rafId = null;
  let phaseIndex = 0;
  let phaseStart = 0;
  let cycles = 0;

  const MIN_SCALE = 0.72;
  const MAX_SCALE = 1.55;

  function setScale(s) {
    core.style.transform = `scale(${s})`;
    halo.style.transform = `scale(${s})`;
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function frame(now) {
    if (!running) return;
    const phases = PATTERNS[patternKey].phases;
    const phase = phases[phaseIndex];
    const elapsed = (now - phaseStart) / 1000;
    const t = Math.min(elapsed / phase.dur, 1);

    // Orb scale per phase
    let scale;
    if (phase.key === 'in') scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * easeInOut(t);
    else if (phase.key === 'out') scale = MAX_SCALE - (MAX_SCALE - MIN_SCALE) * easeInOut(t);
    else scale = phase.key === 'hold' && phaseIndex < 2 ? MAX_SCALE : MIN_SCALE;
    // "hold" after inhale stays big; "hold" after exhale (box) stays small
    if (phase.key === 'hold') {
      const prev = phases[(phaseIndex - 1 + phases.length) % phases.length];
      scale = prev.key === 'in' ? MAX_SCALE : MIN_SCALE;
    }
    setScale(scale);

    const remaining = Math.ceil(phase.dur - elapsed);
    countEl.textContent = `${remaining}`;

    if (t >= 1) {
      phaseIndex = (phaseIndex + 1) % phases.length;
      phaseStart = now;
      if (phaseIndex === 0) cycles++;
      const next = phases[phaseIndex];
      phaseEl.textContent = next.name;
      countEl.textContent = `${next.dur}`;
    }

    rafId = requestAnimationFrame(frame);
  }

  function start() {
    running = true;
    phaseIndex = 0;
    const phases = PATTERNS[patternKey].phases;
    phaseEl.textContent = phases[0].name;
    toggleBtn.innerHTML = `${icons.pause}<span>Pause</span>`;
    patternWrap.querySelectorAll('.chip').forEach((c) => (c.disabled = true));
    phaseStart = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    toggleBtn.innerHTML = `${icons.play}<span>${cycles > 0 ? 'Resume' : 'Begin'}</span>`;
    phaseEl.textContent = cycles > 0 ? 'Paused' : 'Ready when you are';
    countEl.textContent =
      cycles > 0 ? `${cycles} calm ${cycles === 1 ? 'cycle' : 'cycles'} so far` : 'Follow the orb · let your shoulders drop';
    patternWrap.querySelectorAll('.chip').forEach((c) => (c.disabled = false));
    setScale(MIN_SCALE);
  }

  toggleBtn.addEventListener('click', () => (running ? stop() : start()));

  patternWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn || running) return;
    patternKey = btn.dataset.p;
    patternWrap.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === btn)));
  });

  setScale(MIN_SCALE);

  return () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  };
}
