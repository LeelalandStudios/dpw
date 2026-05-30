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

## Project layout

- `src/data/scenario.js` — Characters, axis labels, and the sample scene script
- `src/components/` — Karta, Sakshi, Sakhi panels, end screen
- `src/App.jsx` — Step engine (`message` → `plot` → `choice` → `end`)

## Next steps

- Add rasa copy, questions, and portrait cues per quadrant if desired
- Add branching based on choice `id`
- Persist plot trails per session for reflection
