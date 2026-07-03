# PLAN: GitHub Pages migration + Guided-UX overhaul

**Status:** Not started. Execute phases in order. One task = one commit. Run the
verification step at the end of every task before committing.

## How to execute this plan (read first)

- You are working in a Next.js **16.2.9** App Router project. Conventions may
  differ from your training data. Before using any Next.js API, read the
  relevant guide under `node_modules/next/dist/docs/` (see `AGENTS.md`).
- Read every file you edit **in full** before editing it. Files are small
  (largest is ~250 lines).
- Do not add dependencies unless a task explicitly says so.
- Do not change lesson content (titles, hooks, `aha` text, concepts) in
  `src/lib/lessons/registry.ts`. The pedagogy is settled; only UX changes.
- After every task: `npm run build` must pass. From Phase 1 onward it must also
  emit a complete `out/` folder.
- Manual check: `npx serve out` and click through the affected screens.

## Context: why this plan exists

Early-testing feedback on the current site:

1. Navigation and flow are not clean (redundant links, dead ends, fake locks).
2. Lessons don't guide the learner — multiple controls visible at once, the kid
   doesn't know what to do next. Target: **one action at a time**.
3. The site must run on **GitHub Pages**: fully static, no login, no backend.
   Progress lives in `localStorage` (it already does).

Primary audience: a 9-year-old using it alone. Every screen must answer
"what do I do next?" with exactly one obvious action.

## Ground truth (verified 2026-07-03 — do not re-derive)

- Stack: Next.js 16.2.9 App Router, React 19, Tailwind v4 (imported in
  `globals.css`, but styling is mostly hand-written CSS classes in
  `src/app/globals.css`, 438 lines). Fonts via `next/font/google`
  (Fredoka + Inter) — compatible with static export.
- `@supabase/ssr`, `@supabase/supabase-js`, `zod` are in `package.json` but
  have **zero imports** in `src/`. Safe to remove.
- `next/image` is **not used anywhere**. No API routes, no server actions,
  no middleware/proxy.
- The only dynamic route `src/app/learn/[world]/[lesson]/page.tsx` already has
  `generateStaticParams()`.
- Progress today: `src/lib/progress.ts` stores completed lesson slugs as JSON
  under localStorage key `anayo:completed`. Mode (explorer/curious) is stored
  under `anayo:mode` by `src/lib/mode/mode-context.tsx`.
- Curriculum source of truth: `src/lib/lessons/registry.ts` — 5 worlds,
  12 lessons, 11 live (`l4-3 the-cockpit` has `live: false`, no toy).
- Toys (one interactive component per lesson) live in
  `src/components/lessons/toys/`, registered in the `TOYS` map inside
  `src/components/lessons/lesson-player.tsx`.
- Git: repo has local commits on `master`, **no remote configured**.
- `src/app/journey-classic/page.tsx` is a legacy page referenced by nothing.

## Known UX defects found in code review (fix targets)

- `journey-map.tsx`: "🔒 Locked" badge on worlds is cosmetic — every `live`
  lesson renders as a clickable `<Link>` regardless of lock state.
- `hero.tsx`: two CTAs ("Start building", "See the journey") both go to
  `/journey`. Landing world cards (`page.tsx`) also all link to `/journey` —
  seven links, one destination, zero guidance.
- `lesson-player.tsx`: after a lesson, the `done` phase says "More lessons are
  landing soon" and links back to `/journey`. Dead end — no "next lesson".
  Also `aha` → `done` is two consecutive screens that each need a click.
- No "continue where you left off" anywhere; a returning kid starts from a
  generic landing page.
- Mode toggle (Explorer/Curious) sits in the header on every screen, including
  mid-lesson — easy for a kid to flip accidentally, irrelevant to the task.
- `toys/what-is-ai.tsx`: shows rule card + brush picker + all blobs at once;
  the kid must discover a brush mode-switch. Instruction text exists but the
  UI doesn't enforce the sequence.

---

## Phase 0 — Hygiene & repo setup

### 0.1 Remove dead code and dependencies
- `npm uninstall @supabase/ssr @supabase/supabase-js zod`
- Delete `src/app/journey-classic/` and `.env.local.example`.
- Update `README.md`: remove any Supabase/Vercel setup instructions; state the
  stack as "Next.js static export, deployed to GitHub Pages, progress in
  localStorage, no accounts".
- Add one line to `AGENTS.md`: `Active migration plan: see PLAN.md.`
- **Verify:** `npm run build` passes; `grep -ri supabase src/` finds nothing.

### 0.2 Create GitHub repo and push
- `gh repo create anayo --public --source . --push` (ask the user to run
  `gh auth login` first if not authenticated).
- Default branch: keep `master` or rename to `main` — if renamed, remember the
  branch name for the workflow in 1.2.
- **Verify:** `git remote -v` shows origin; branch is pushed.

---

## Phase 1 — Static export + GitHub Pages deploy

Goal: the site builds to `out/` and auto-deploys on every push. Ship this
before any UX work so all later phases are continuously deployable.

### 1.1 Enable static export
Edit `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // GH Pages serves folder/index.html; makes deep-link refresh reliable
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  images: { unoptimized: true }, // next/image unused today; prevents build breakage if added later
};

export default nextConfig;
```

- Add `public/.nojekyll` (empty file) so GH Pages serves the `_next/` folder.
- Audit for absolute asset URLs that would break under a base path:
  `grep -rn 'src="/' src/ && grep -rn 'url(/' src/app/globals.css` — rewrite
  any hits to relative or code-based paths. (`next/link` hrefs are fine —
  Next prefixes `basePath` automatically.)
- **Verify:** `npm run build` emits `out/` containing `index.html`,
  `journey/index.html`, `404.html`, and one folder per lesson under
  `out/learn/<world>/<lesson>/index.html` (11 live + 1 stub = 12).
  Then `npx serve out` and click landing → journey → a lesson → complete it.

### 1.2 GitHub Actions deploy workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [master] # adjust if branch was renamed in 0.2
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: /anayo # repo name; REMOVE this env for custom-domain deploys (Phase 6)
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- In the GitHub repo settings → Pages, set **Source: GitHub Actions**
  (`gh api -X PUT repos/{owner}/anayo/pages --field build_type=workflow` or ask
  the user to click it).
- **Verify:** push, watch the run (`gh run watch`), then load
  `https://<owner>.github.io/anayo/` — landing renders with styles, journey
  map works, a lesson can be completed, refresh on a deep lesson URL works.

---

## Phase 2 — Progress engine (foundation for all UX work)

### 2.1 Versioned progress store
Rewrite `src/lib/progress.ts`:

```ts
export type Progress = {
  v: 1;
  completed: string[];   // lesson slugs, in completion order
  abilities: string[];   // ability ids collected (from registry)
  lastLesson?: string;   // slug of the last lesson the kid OPENED
  updatedAt: string;     // ISO timestamp
};
```

- Single localStorage key `anayo:progress`. Every mutation goes through one
  `save()` that bumps `updatedAt` and notifies subscribers.
- **Migration:** on first read, if `anayo:progress` is absent but legacy
  `anayo:completed` exists, convert it (abilities derived from registry via
  completed slugs) and write the new key. Do not delete the legacy key.
- API: `getProgress()`, `markComplete(slug)`, `setLastLesson(slug)`,
  `resetProgress()`, `subscribe(fn): unsubscribe`. All localStorage access
  wrapped in try/catch (build-time prerender has no `window` — only touch
  localStorage inside functions called from effects/events, as today).
- Add `src/lib/use-progress.ts`: `useProgress()` React hook — subscribes,
  returns `Progress`, updates on change and on the `storage` event.
- Derived helpers in `src/lib/lessons/registry.ts` (pure, unit-testable):
  - `nextLesson(completed: string[])` → first live lesson not completed, with
    its world; `null` when everything live is done.
  - `isUnlocked(slug, completed)` → true iff every **live** lesson before it
    (registry order) is completed. First lesson always unlocked. Non-live
    lessons are skipped in the chain (the-cockpit must not block World 5).
- **Verify:** build passes; in the browser, completing a lesson updates the
  map without a reload; a legacy `anayo:completed` value seeded via DevTools
  migrates correctly.

### 2.2 Save codes (progress portability, no accounts)
- `src/lib/save-code.ts`: `exportCode(p: Progress): string` — compact JSON →
  base64url, prefixed `ANAYO1.`; `importCode(s): Progress | null` — validates
  shape, rejects garbage.
- UI comes in 3.4. Keep this task logic-only.
- **Verify:** round-trip in a quick node script or browser console:
  `importCode(exportCode(p))` deep-equals `p`; `importCode("junk")` → null.

---

## Phase 3 — Navigation & flow overhaul

Design rules for every task in this phase (also apply to Phase 4):

1. **One primary action per screen.** Anything else is visually secondary.
2. Every screen answers "what's next?" — the primary CTA always targets
   `nextLesson()`.
3. **No dead ends.** Finishing a lesson leads to the next lesson.
4. **Locks are real.** Locked = not clickable, visibly locked.
5. Kid-first: big tap targets (min 44px), one short instruction at a time,
   no mode toggles mid-flow.

### 3.1 Landing page = one door
`src/app/page.tsx`, `src/components/hero.tsx`:
- Hero shows **one** primary CTA (client component using `useProgress()`):
  - No progress → `▶ Start your journey` → href of lesson 1.
  - In progress → `▶ Continue: {ability.icon} {title}` → next lesson href.
  - All done → `🎉 See your journey` → `/journey`.
- Demote "See the journey →" to the single ghost/secondary link.
- World cards become **non-interactive** preview cards (remove `<Link>`, keep
  visuals). Cursor default, no hover-lift.
- **Verify:** fresh profile shows Start; after completing lesson 1 the CTA
  reads Continue with lesson 2's title.

### 3.2 Journey map: real locks + focus on "you are here"
`src/components/journey-map.tsx`:
- Use `useProgress()` + `isUnlocked()`. Locked lessons render as `<div>` with
  a 🔒 node, dimmed, `aria-disabled="true"` — never a `<Link>`. Remove the
  now-truthful world badge logic accordingly.
- Keep `live: false` lessons as "coming soon" (existing `jml-future` style),
  never as locked-but-unlockable.
- Auto-focus: on mount, `scrollIntoView({ block: "center" })` on the "next"
  node. The next node keeps its existing pulse treatment.
- Header strip above the map: `⭐ {completed}/{liveCount} superpowers unlocked`
  plus the collected ability icons as chips (data from `useProgress()`).
- **Verify:** with empty progress only lesson 1 is clickable; completing it
  unlocks exactly lesson 2; map opens scrolled to the pulsing node.

### 3.3 Lesson end flows forward
`src/components/lessons/lesson-player.tsx`:
- On mount, call `setLastLesson(lesson.slug)`.
- Collapse `aha` + `done` into **one** celebration screen: buddy + ability
  chip + aha text + primary CTA:
  - Next lesson in same world → `Next: {icon} {title} →`.
  - Next lesson in a different world → interstitial line
    `🌍 World complete: {world.title}!` above the CTA, then link to next world's
    first lesson.
  - Nothing left → graduation screen: all ability chips, `🎓 You did it!`,
    ghost link to `/journey`.
  - Ghost secondary under the CTA: `← Back to map`.
- Remove the `done` phase entirely (`Phase = "hook" | "play" | "aha"`).
- Add a 3-dot phase indicator (hook/play/aha) at the top of the player so the
  kid sees where they are inside a lesson.
- **Verify:** completing lesson N lands one click away from lesson N+1;
  finishing `show-dont-tell` (last of World 3) shows the world-complete
  interstitial; finishing the final lesson shows graduation.

### 3.4 Header slimming + save-code UI
`src/components/site-header.tsx` + a new `src/components/save-code-dialog.tsx`:
- Lesson pages: header shows only logo (→ `/journey`, not `/`) and a `✕` exit
  link to `/journey`. **No mode toggle mid-lesson.**
- Landing + journey pages: keep the mode toggle, move it visually secondary
  (smaller, right-aligned; landing only if that's simpler).
- Journey page footer: `💾 Save code` button → dialog with two tabs:
  "Get my code" (shows `exportCode()` output, tap-to-copy, kid copy:
  "Your secret code — write it down or send it to another computer!") and
  "Enter a code" (paste box → `importCode()`; on success overwrite progress
  and refresh the map; on failure a gentle "That code doesn't look right 🤔").
- **Verify:** export on one browser profile, import on a fresh one →
  identical map state. Mode toggle absent inside a lesson.

---

## Phase 4 — One-action-at-a-time inside every toy

### 4.1 Shared guidance primitives
New `src/components/lessons/guide.tsx`, styles in `globals.css`:
- `<GuideBar step={n} total={m}>{instruction}</GuideBar>` — one short
  instruction, fixed position above the toy area, step dots. Re-renders with a
  small attention animation when the instruction changes.
- `<BigButton>` — the single primary action button style used at the moment a
  toy needs an explicit action (e.g. "🧠 Teach Anayo").
- **Verify:** build passes; component renders in isolation on one converted
  toy (4.2) before converting the rest.

### 4.2 The conversion checklist (apply to every toy)
Work **one toy per commit**, in curriculum order. A toy passes when:

1. At any moment exactly **one** cluster of controls is enabled; controls for
   future steps are hidden (not merely dimmed).
2. `<GuideBar>` shows exactly one instruction, derived from state; it never
   shows two instructions or stale text.
3. When a step's goal is met, the toy **auto-advances** (no hunting for the
   next control).
4. A wrong or no-op tap gives a gentle inline hint near the guide bar; never
   silent, never blocking.
5. The final action is either automatic (`onComplete()` fires when the goal
   state is reached) or one unmistakable `<BigButton>`.

Reference conversion, `toys/what-is-ai.tsx` (do this one first):
- Kill the brush picker (mode-switch = classic kid-UX failure). Step 1: brush
  is implicitly 💜 — "Tap the 2 biggest blobs 💜". After 2 love-labels,
  auto-advance. Step 2: brush implicitly 🚫 — "Now tap the 2 smallest 🚫".
  Step 3: single `<BigButton>🧠 Teach Anayo</BigButton>`; predictions animate
  in; then `onComplete()`.
- Move the "secret rule" reveal out of the persistent rule card: it belongs in
  the hook phase or the aha text, not on screen during play.

Then audit and convert the remaining 10 toys against the checklist:
`words-into-numbers`, `predict-next-word`, `the-big-brain`,
`paying-attention`, `the-art-of-asking`, `show-dont-tell`,
`from-talking-to-doing`, `step-by-step`, `coding-with-ai`,
`build-something-real`. Some already stage actions well (e.g. `step-by-step`
per its commit message) — for those, only add `<GuideBar>` consistency and
verify the checklist; don't rebuild working flows.

- **Verify per toy:** play it start to finish with DevTools mobile viewport
  (390px wide); confirm each checklist item; `npm run build`.

---

## Phase 5 — Light motivation layer (small, do not bloat)

### 5.1 Buddy grows with abilities
- `src/components/anayo-buddy.tsx` already accepts a `tray` prop. On the
  journey page and lesson celebration screen, pass the collected ability
  icons from `useProgress()` so the buddy visibly accumulates superpowers.
- **Verify:** buddy on the journey page shows one more chip after each lesson.

### 5.2 Optional (skip if time-boxed): per-step micro-feedback
- Tiny sparkle/pop on each completed step inside toys (CSS-only, respect
  `prefers-reduced-motion`). Confetti on lesson completion already exists —
  do not duplicate it per-step.

---

## Phase 6 — Custom domain cutover (OPTIONAL — user decision required)

Only execute when the user confirms pointing `anayo.ai` at GitHub Pages:

- Add `public/CNAME` containing `anayo.ai`.
- **Remove** the `NEXT_PUBLIC_BASE_PATH` env from the workflow (custom domain
  serves from `/`).
- User actions: DNS `A`/`ALIAS` records per GitHub Pages docs; repo settings →
  Pages → custom domain + enforce HTTPS; retire the Vercel deployment.
- ⚠️ Origin change wipes localStorage progress. The save-code feature (3.4) is
  the migration path — surface a one-time banner on the old origin if the
  Vercel site is still live, telling users to export their code.

---

## Guardrails (apply to every phase)

- No new runtime dependencies. Dev-deps only if a task says so (none do).
- No UI component libraries; extend the existing hand-rolled CSS system in
  `globals.css` using its design tokens.
- `src/lib/lessons/registry.ts` stays the single source of truth for the
  curriculum; UI derives everything from it.
- Never render differently on server vs first client paint (hydration): read
  localStorage only in effects, exactly as the existing code does.
- Keep every screen usable at 390px width.
- Commit messages: imperative, one task per commit, reference the task number
  (e.g. `3.2 journey map: real locks + autofocus`).
