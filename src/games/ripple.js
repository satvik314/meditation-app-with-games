// Ripple Pond — a grounding game. Tap or drag anywhere to send calm ripples
// across the water and release drifting motes of light. No score, no failing —
// just a place to slow your hands and your breath before returning to work.

export function mountRipple(root) {
  root.innerHTML = `
    <canvas class="ripple-canvas" id="pond"></canvas>
    <div class="stage-hint">Tap the water · let each ripple settle before the next</div>
  `;

  const canvas = root.querySelector('#pond');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const PALETTE = [
    { r: 27, g: 152, b: 224 }, // techno blue
    { r: 209, g: 73, b: 91 }, // red
    { r: 203, g: 181, b: 144 }, // deep sand
    { r: 14, g: 107, b: 168 }, // blue-dark
  ];

  let width = 0;
  let height = 0;
  const ripples = [];
  const motes = [];
  let rafId = null;
  let lastEmit = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function addRipple(x, y) {
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    ripples.push({
      x,
      y,
      radius: 6,
      maxRadius: 120 + Math.random() * 90,
      alpha: 0.55,
      color,
      speed: 1.1 + Math.random() * 0.5,
    });
    // a few drifting motes rising from the touch point
    const n = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      motes.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.5,
        life: 1,
        decay: 0.004 + Math.random() * 0.004,
        size: 1.5 + Math.random() * 2.5,
        color,
      });
    }
  }

  function pointer(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }

  function onDown(e) {
    e.preventDefault();
    const { x, y } = pointer(e);
    addRipple(x, y);
  }

  function onMove(e) {
    if (e.buttons !== 1 && !e.touches) return;
    const now = performance.now();
    if (now - lastEmit < 90) return; // throttle to keep it calm, not frantic
    lastEmit = now;
    const { x, y } = pointer(e);
    addRipple(x, y);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // soft water backdrop
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, 'rgba(27, 152, 224, 0.04)');
    g.addColorStop(1, 'rgba(203, 181, 144, 0.06)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.radius += rp.speed;
      rp.alpha *= 0.985;
      const progress = rp.radius / rp.maxRadius;
      if (progress >= 1 || rp.alpha < 0.02) {
        ripples.splice(i, 1);
        continue;
      }
      const { r, g: gg, b } = rp.color;
      // outer ring
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${gg},${b},${rp.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      // inner ring
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.radius * 0.62, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${gg},${b},${rp.alpha * 0.5})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    // motes
    for (let i = motes.length - 1; i >= 0; i--) {
      const m = motes[i];
      m.x += m.vx;
      m.y += m.vy;
      m.vy *= 0.995;
      m.life -= m.decay;
      if (m.life <= 0) {
        motes.splice(i, 1);
        continue;
      }
      const { r, g: gg, b } = m.color;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${gg},${b},${m.life * 0.7})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgba(${r},${gg},${b},${m.life * 0.5})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    rafId = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  canvas.addEventListener('mousedown', onDown);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('touchstart', onDown, { passive: false });
  canvas.addEventListener('touchmove', onMove, { passive: false });

  // a gentle opening ripple so the pond is never empty
  setTimeout(() => addRipple(width / 2, height / 2), 250);

  rafId = requestAnimationFrame(draw);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    ro.disconnect();
    canvas.removeEventListener('mousedown', onDown);
    canvas.removeEventListener('mousemove', onMove);
    canvas.removeEventListener('touchstart', onDown);
    canvas.removeEventListener('touchmove', onMove);
  };
}
