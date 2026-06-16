# Moodbase Dashboard — editorial redesign

A ready-to-run React + Vite preview of the redesigned Moodbase dashboard.
Run it locally, click around, then port the pieces into your Vercel app.

## Run it

```bash
cd handoff
npm install
npm run dev
```

Vite opens http://localhost:5173 automatically.

```bash
npm run build && npm run preview   # production build preview
```

## What's here

```
handoff/
├── index.html               # Vite entry; loads Montserrat (Google Fonts)
├── package.json             # React 18 + Vite
├── vite.config.js
├── public/
│   └── fonts/
│       └── custom.ttf       # Neue Haas Grotesk Display (Black) — display font
└── src/
    ├── main.jsx             # renders <Dashboard> with the mock data
    ├── Dashboard.jsx        # layout + state + filtering (the orchestrator)
    ├── data.js              # PROJECTS / TAGS / SAVES / SIGNATURE (mock)
    ├── mockBrain.js         # fake chat replies for the local preview — DELETE in prod
    ├── styles.css           # the whole design system (tokens in :root)
    └── components/
        ├── Icon.jsx         # stroke icon set + grad() helper
        ├── Masthead.jsx     # top bar: logo, semantic search, actions
        ├── Sidebar.jsx      # Projects + Tags rail
        ├── TasteSignature.jsx  # the editorial hero band
        ├── Toolbar.jsx      # title + sort / view / export
        ├── Card.jsx         # a single save tile
        ├── Grid.jsx         # masonry of cards + empty state
        ├── DetailOverlay.jsx   # fullscreen save detail modal
        └── ChatPanel.jsx    # "Ask your brain" panel
```

## Theming

All color/type/spacing lives as CSS variables in `:root` (and a `.mb-light`
override) at the top of `src/styles.css`. The app starts in dark mode; the
sun/moon button toggles the `.mb-light` class on the root wrapper. To rebrand,
just change the `:root` values — everything cascades.

## Fonts

- **Display** (wordmark, hero headline, section titles): `custom.ttf`
  (Neue Haas Grotesk Display Black), loaded via `@font-face` → `/fonts/custom.ttf`.
  Only the Black weight is included, so all display text is heavy by design.
  Drop in a Roman/Regular weight and add a second `@font-face` if you want
  lighter headings.
- **Body / UI**: Montserrat, loaded from Google Fonts in `index.html`.

## Wiring it to real data (3 places)

Everything else is presentational. To make it real, change these:

1. **The library** — replace the arrays in `src/data.js` with your Supabase
   queries. Card images: add an `imageUrl` to each save and render an `<img>`
   in `Card.jsx` / `DetailOverlay.jsx` where the `.mb-card-grad` placeholder is
   (a comment marks the spot).

2. **Semantic search** — in `Dashboard.jsx`, the `if (query.trim())` block does
   a naive keyword match over a hidden `vibe` string. Swap it for your
   OpenAI-embeddings + pgvector cosine-similarity retrieval. The UI already
   handles `match` / `dim` card states from the returned id set.

3. **Ask your brain** — `askBrain()` in `Dashboard.jsx` currently calls
   `mockBrainReply()`. Replace it with a fetch to your Claude endpoint, append
   the reply to `messages`, and delete `mockBrain.js`. The `typing` state and
   `<em>` accent emphasis are already wired.

## Notes

- Chat messages render with `dangerouslySetInnerHTML` to allow `<em>` emphasis.
  Sanitize your model output before merging to production.
- Fully responsive: the rail and chat collapse to drawers below 1180px.
- No state library or router — it's intentionally a single self-contained view
  so you can lift components out one at a time.
```
