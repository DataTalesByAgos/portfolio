# Project Overview: Portfolio (data.tales)

A premium lofi-themed portfolio website designed for an AI & Product Engineer. The design uses rich aesthetics, including a video background, custom pixel glowing clock, dark glassmorphism card layouts, and bilingual language toggles.

## Tech Stack
- **Framework**: React 19 + Vite 8 (Single Page Application)
- **Styling**: Vanilla CSS object (`const s` in `src/App.jsx`) + Tailwind CSS (v3) + Inline style injections for custom animations.
- **Animations**: Framer Motion & CSS Keyframes.
- **Icons**: Inline SVGs & Lucide React.
- **Fonts**: VT323 (pixel elements/logo), JetBrains Mono / Fira Code (monospaced strings), Inter (hero title).

## Codebase Architecture
- [src/App.jsx](file:///c:/Users/agos/Downloads/portafolio/src/App.jsx): Main entry point containing layout, components, custom CSS keyframe animations, styling variables, state management (language, tabs, active blog post lightbox, skills group).
- [src/data/](file:///c:/Users/agos/Downloads/portafolio/src/data/):
  - [index.js](file:///c:/Users/agos/Downloads/portafolio/src/data/index.js): Imports and exports localized data.
  - `es/`: JSON files containing Spanish content (ui, projects, blog).
  - `en/`: JSON files containing English content (ui, projects, blog).
- `public/`:
  - Assets like the video background `/ui/Enhancer-HD-Upscaler-1080P - HD-bg_done.mp4` and image folders.

## Routing
- **Bilingual Toggling**: Managed by the `language` state inside `App.jsx` and localized JSON structures.
- **Deep Linking**: Blog posts are deeply linkable via URL hashes like `#post-{id}` (e.g., `#post-5`). If a user opens the page with a post hash, it opens automatically. Closing the post resets the hash back to `#blog`, returning the scroll position to the list. This supports forward/back navigation natively.

## Development Guide for AI Agents
1. **Adding/Modifying Text Content**:
   - Locate the target text in `src/data/es/ui.json`.
   - Update/Add the key in both `src/data/es/ui.json` and `src/data/en/ui.json`.
   - Reference it in `src/App.jsx` using `data.<section>.<key>`.
2. **Styling Guidelines**:
   - Maintain the lofi aesthetic. Accent colors are emerald green (`#4ade80`, `#16a34a`).
   - Use pixel-style fonts (VT323) for titles and pixel art elements.
   - Adjust screen dimensions in CSS media queries block inside the CSS `<style>` injection in `App.jsx`.
