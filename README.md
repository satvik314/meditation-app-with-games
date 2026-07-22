# Still · Mindful Games

A calm meditation app with **three mindful games** designed to reset a drifting mind and help you get back to the task. Built with **Vite** (vanilla JS, zero UI framework) and themed around a warm, focused palette of **Beige · Red · Techno Blue**.

## The three games

| Game | Purpose | What you do |
| --- | --- | --- |
| **Guided Breath** | Regulate | Follow a glowing orb that swells and settles with your breath. Choose **Box (4-4-4-4)** or **Calm (4-7-8)** breathing. |
| **Ripple Pond** | Ground | Tap anywhere on the water to send calming ripples and release drifting motes of light. No score, no losing — just slow hands. |
| **Focus Flow** | Sharpen | A gentle Simon-style attention trainer. Watch a sequence of tiles light up, then echo it back. Each round adds one step. Your best streak is remembered. |

## Design

- **Beige** — the calm base and surfaces
- **Red** — warmth and energy accents
- **Techno Blue** — focus and interactive elements

Fully responsive, works with keyboard/mouse/touch, and respects `prefers-reduced-motion`.

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
npm run build   # build for production into dist/
npm run preview # preview the production build
```

## Project structure

```
index.html            App shell + fonts
src/
  main.js             Home screen, routing, game shell
  style.css           Design system + all component styles
  icons.js            Inline SVG icons
  games/
    breathing.js      Guided Breath (orb + patterns)
    ripple.js         Ripple Pond (canvas)
    focus.js          Focus Flow (memory/attention)
```
