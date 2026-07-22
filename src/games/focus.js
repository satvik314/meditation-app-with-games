import { icons } from '../icons.js';

// Focus Flow — a calm attention trainer. Watch the sequence of glowing tiles,
// then repeat it back. Each round adds one step, gently stretching your working
// memory and pulling your attention into a single, quiet point.

const COLORS = ['blue', 'red', 'sand', 'ink'];
const BEST_KEY = 'still.focus.best';

export function mountFocus(root) {
  root.innerHTML = `
    <div class="simon">
      <div class="stat-row">
        <div class="stat"><div class="label">Round</div><div class="value blue" id="round">0</div></div>
        <div class="stat"><div class="label">Best</div><div class="value red" id="best">0</div></div>
      </div>
      <div class="simon-status" id="status">Watch the light, then echo it back.</div>
      <div class="simon-pad" id="pad">
        ${COLORS.map((c) => `<button class="simon-tile" data-c="${c}" aria-label="${c} tile" disabled></button>`).join('')}
      </div>
      <button class="btn btn-primary" id="start">${icons.play}<span>Start</span></button>
    </div>
  `;

  const pad = root.querySelector('#pad');
  const tiles = Array.from(pad.querySelectorAll('.simon-tile'));
  const statusEl = root.querySelector('#status');
  const roundEl = root.querySelector('#round');
  const bestEl = root.querySelector('#best');
  const startBtn = root.querySelector('#start');

  let sequence = [];
  let input = [];
  let accepting = false;
  let best = Number(localStorage.getItem(BEST_KEY) || 0);
  const timers = [];
  let disposed = false;

  bestEl.textContent = best;

  function wait(ms) {
    return new Promise((resolve) => {
      const t = setTimeout(resolve, ms);
      timers.push(t);
    });
  }

  function clearTimers() {
    while (timers.length) clearTimeout(timers.pop());
  }

  function tileByColor(c) {
    return tiles.find((t) => t.dataset.c === c);
  }

  async function flash(color, dur = 460) {
    const tile = tileByColor(color);
    if (!tile) return;
    tile.classList.add('lit');
    await wait(dur);
    if (disposed) return;
    tile.classList.remove('lit');
    await wait(180);
  }

  async function playSequence() {
    accepting = false;
    setTilesEnabled(false);
    statusEl.innerHTML = `<span class="accent-blue">Watch</span> the sequence…`;
    await wait(500);
    for (const color of sequence) {
      if (disposed) return;
      await flash(color);
    }
    if (disposed) return;
    statusEl.innerHTML = `Your turn — <span class="accent-red">echo it back</span>`;
    accepting = true;
    input = [];
    setTilesEnabled(true);
  }

  function setTilesEnabled(on) {
    tiles.forEach((t) => (t.disabled = !on));
  }

  function nextRound() {
    input = [];
    sequence.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
    roundEl.textContent = sequence.length;
    playSequence();
  }

  async function handlePress(color) {
    if (!accepting) return;
    const tile = tileByColor(color);
    tile.classList.add('lit');
    setTimeout(() => tile.classList.remove('lit'), 200);

    input.push(color);
    const idx = input.length - 1;

    if (input[idx] !== sequence[idx]) {
      // gentle failure — no harsh game over
      accepting = false;
      setTilesEnabled(false);
      const reached = sequence.length - 1;
      if (reached > best) {
        best = reached;
        localStorage.setItem(BEST_KEY, String(best));
        bestEl.textContent = best;
      }
      statusEl.innerHTML = `A soft miss at round <span class="accent-red">${sequence.length}</span>. Breathe, and try again.`;
      startBtn.innerHTML = `${icons.restart}<span>Try again</span>`;
      startBtn.hidden = false;
      sequence = [];
      roundEl.textContent = 0;
      return;
    }

    if (input.length === sequence.length) {
      accepting = false;
      setTilesEnabled(false);
      if (sequence.length > best) {
        best = sequence.length;
        localStorage.setItem(BEST_KEY, String(best));
        bestEl.textContent = best;
      }
      statusEl.innerHTML = `<span class="accent-blue">Steady.</span> Round ${sequence.length} complete.`;
      await wait(750);
      if (disposed) return;
      nextRound();
    }
  }

  pad.addEventListener('click', (e) => {
    const tile = e.target.closest('.simon-tile');
    if (!tile || tile.disabled) return;
    handlePress(tile.dataset.c);
  });

  startBtn.addEventListener('click', () => {
    clearTimers();
    sequence = [];
    input = [];
    roundEl.textContent = 0;
    startBtn.hidden = true;
    nextRound();
  });

  return () => {
    disposed = true;
    clearTimers();
  };
}
