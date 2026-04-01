# musicbot.ai

Search any song and instantly see its BPM, musical key, mode, and Camelot code.

Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS.

---

## Prerequisites

- **Node.js 18.18 or later** — [nodejs.org](https://nodejs.org)
- **npm** (bundled with Node) or **pnpm / yarn** if you prefer

---

## Setup

### 1. Install dependencies

This downloads all packages listed in `package.json` into `node_modules/`.

```bash
npm install
```

---

### 2. Start the development server

Next.js compiles the app and starts a local server with hot-reload.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page will update automatically as you edit files.

---

### 3. Build for production (optional)

Compiles and optimizes the app for deployment.

```bash
npm run build
```

### 4. Run the production build locally (optional)

Serves the compiled output the same way a hosting provider would.

```bash
npm start
```

---

## Project structure

```
src/
  app/
    globals.css          # Tailwind base styles + CSS variables
    layout.tsx           # Root layout (html/body, metadata)
    page.tsx             # Homepage — search bar
    song/
      [id]/
        page.tsx         # Dynamic song detail page (/song/<track-id>)
tailwind.config.ts       # Tailwind content paths and theme extensions
next.config.ts           # Next.js configuration
tsconfig.json            # TypeScript compiler options
```

---

## Roadmap

- [ ] Integrate Spotify Web API to resolve search queries to real track IDs
- [ ] Fetch audio features (BPM, key, mode) from Spotify's audio-analysis endpoint
- [ ] Map Spotify key/mode integers to human-readable labels and Camelot codes
- [ ] Add search results page with multiple matches
- [ ] Add loading and error states
