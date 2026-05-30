# DPW

Game-based mental health prototype (React + Vite).

## Core loop (prototype)

1. **Karta space** — The scripted dialogue between characters plays out line by line.
2. **Sakshi space** — Lens tabs: **4 Quadrant** matrix, **Body Rasa** (tap where you feel it), **AIF** (select a letter from the Samkhya table).
3. **Sakhi space** — Nudge Jordan with what to say; your picks show as a side conversation with him.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Deploy on Netlify

The repo includes `netlify.toml` so Netlify runs `npm run build` and publishes the `dist` folder.

**Site settings (should match automatically):**

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 20 or 22 |

If you see a **blank page**, the site is usually serving the unbuilt app (browser 404 on `/src/main.jsx`). Trigger a new deploy after pushing `netlify.toml`, or set the publish directory to `dist` in the Netlify UI.

**Do not** set publish directory to `.` or the repo root without a build step.

## Project layout

- `src/data/scenario.js` — Characters, axis labels, and the sample scene script
- `src/components/` — Karta, Sakshi, Sakhi panels, end screen
- `src/App.jsx` — Step engine (`message` → `plot` → `choice` → `end`)

## Next steps

- Add rasa copy, questions, and portrait cues per quadrant if desired
- Add branching based on choice `id`
- Persist plot trails per session for reflection
