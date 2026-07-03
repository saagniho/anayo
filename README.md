# Anayo — Build Your AI Buddy

An AI-literacy site for curious kids (8–15) and the grown-ups who love them.
Learn how AI really works — tokens, transformers, prompting, agents — by
unlocking superpowers for a little AI buddy, one hands-on lesson at a time.

## Stack

- **Next.js (App Router) static export** — no server, no API routes
- **Deployed to GitHub Pages** — plain static hosting
- **Progress in `localStorage`** — no accounts, no login, no backend
- Curriculum is data: `src/lib/lessons/registry.ts` defines 5 worlds and 12
  lessons; each playable lesson is a "toy" component in
  `src/components/lessons/toys/`

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export → out/
```

To preview the production build locally: `npx serve out`

## Deployment

Pushes to the default branch build and deploy automatically to GitHub Pages
via `.github/workflows/deploy.yml`.

## Roadmap

See `PLAN.md` for the active migration and UX-overhaul plan.
