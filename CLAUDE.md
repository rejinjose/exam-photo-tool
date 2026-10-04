# Exam Photo Tool — Project Rules

A free, browser-only tool that resizes and compresses photos and signatures
to match Indian exam and government form rules (SSC, UPSC, PSC, NTA, bank exams, passport).

## Non-negotiables

- **No backend, no database.** Everything runs in the user's browser.
- **Images never leave the device.** No network request may contain image data.
  Analytics may send event names and numbers only, never images or file names.
- **Never invent exam rules.** Values in `src/data/exams.json` come only from official
  notifications, added by Rejin with a `source` URL. If a value is missing, leave the
  entry `"verified": false` and ask. Do not fill numbers from memory or blogs.
- **One ticket at a time.** Work only on the ticket in progress. Note other ideas in
  `docs/backlog/BACKLOG.md` under "Icebox" instead of building them.

## Stack

- Astro (static pages, one per exam) + React islands for the tool
- TypeScript (strict), Tailwind CSS
- Image work: Canvas API inside a Web Worker (OffscreenCanvas, with main-thread fallback)
- Cropping: react-easy-crop
- Tests: Vitest + React Testing Library (unit), Playwright (smoke)
- Hosting: Cloudflare Pages, auto-deploys from `main`

## Commands

- `npm run dev` — local dev server
- `npm run check` — lint + typecheck + unit tests + build (must pass before every commit)
- `npm run test` — unit tests only
- `npm run test:smoke` — Playwright smoke test of the core flow

## Structure

```
src/
  data/exams.json        exam rule presets (human-verified only)
  lib/                   pure functions: crop math, resize, compress, validate
  workers/               Web Worker wrappers around lib/
  components/            React UI
  pages/                 Astro pages; pages/exam/[id].astro per preset
tests/
  unit/                  mirrors src/lib and src/components
  smoke/                 Playwright specs
  fixtures/              sample photos and signatures
docs/backlog/BACKLOG.md  tickets and status
```

## Code rules

- Image logic lives in `src/lib/` as pure, testable functions. UI components call them;
  they don't contain image math.
- Mobile-first. Test layouts at 360px width.
- Every user-facing error says what went wrong and what to do next.
- Keep dependencies minimal. Ask before adding any package not listed in Stack.

## Testing rules

- Every acceptance criterion in a ticket gets at least one test.
- Run the **full** suite (`npm run check` and `npm run test:smoke`) before marking a ticket done.
- Never delete, skip, or weaken an existing test to make it pass. If an old test fails,
  fix the code. If the ticket intentionally changes that behaviour, update the test and
  explain why in the PR.
- Update the smoke test whenever the main user flow changes.

## Git rules

- Branch per ticket: `T-XX-short-slug` (e.g. `T-09-compress-to-kb`).
- Commits: `feat(T-09): ...`, `fix(T-09): ...`, `test(T-09): ...`, `chore(T-09): ...`.
- Never commit or push directly to `main`. Never force-push.
- Changes reach `main` only through a pull request with green CI.

## Workflow

Use the `/my-ticket` skill to work on tickets. It handles branch, tests, PR and merge.
