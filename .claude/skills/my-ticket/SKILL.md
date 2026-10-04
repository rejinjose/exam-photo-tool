---
name: my-ticket
description: Work on the next ticket from docs/backlog/BACKLOG.md end to end — new branch, implement, write tests, run the full regression and smoke suite, open a pull request, wait for CI, then merge to main. Use whenever Rejin says "/my-ticket", "next ticket", "pick up T-XX", "work on the backlog", or asks to build the next feature.
---

# my-ticket — one ticket, start to merge

## Settings

- `MERGE_MODE: ask` — stop before merging and wait for Rejin to say "merge".
  Change to `auto` to merge automatically once CI is green.

## Steps

### 1. Pre-flight
- Run `git status`. If the working tree is not clean, stop and ask what to do.
- `git checkout main && git pull`.
- Run `npm run check` (skip if `package.json` doesn't exist yet). If `main` is already
  broken, stop and report it. Don't build on a broken base.

### 2. Pick the ticket
- If Rejin named one (`/my-ticket T-09`), use it.
- Otherwise take the first ticket in BACKLOG.md with `Status: todo`, `Owner: Claude`,
  and every `Depends on` ticket `done`.
- Skip tickets with `Owner: Rejin`. If a needed Rejin ticket isn't done, say which one
  blocks progress and stop.
- Print the ticket and a short plan (files to touch, tests to add). If the acceptance
  criteria are ambiguous or the plan needs a new dependency, ask before coding.
  Otherwise continue.

### 3. Branch
- `git checkout -b T-XX-short-slug`
- Set the ticket to `Status: in-progress` in BACKLOG.md.

### 4. Build
- Implement only what the ticket asks. Follow CLAUDE.md.
- Write unit tests covering every acceptance criterion.
- If the main user flow changed, update `tests/smoke/`.

### 5. Full test gate
- Run `npm run check` and `npm run test:smoke`.
- Fix failures and rerun until both pass.
- Never delete, skip or weaken an existing test to get green. If an old test breaks
  because the ticket deliberately changes behaviour, update it and note why.
- If still failing after three serious attempts, stop, commit work in progress on the
  branch, and report what's failing and what you tried.

### 6. Commit and open PR
- Set the ticket to `Status: done` and add a one-line note of what was built.
- Commit with `feat(T-XX): <summary>` (split into logical commits if large).
- `git push -u origin <branch>`
- Write the PR body from `.github/pull_request_template.md` (what changed, how it was
  tested, what Rejin should check by hand) into a temp file, then
  `gh pr create --base main --title "T-XX: <ticket title>" --body-file <temp file>`.

### 7. Wait for CI
- `gh pr checks --watch`
- If CI fails, fix on the same branch, push, and watch again.

### 8. Merge
- `MERGE_MODE: ask` → post a short summary (what changed, tests added, PR link,
  manual checks to do) and wait. Merge only after Rejin says "merge".
- `MERGE_MODE: auto` → continue once CI is green.
- `gh pr merge --squash --delete-branch`
- `git checkout main && git pull`

### 9. Stop
- Report: ticket done, PR merged, what's next in the backlog.
- Do **not** start the next ticket on your own.

## Never
- Push or commit directly to `main`, or force-push.
- Invent values in `src/data/exams.json`.
- Work on more than one ticket per run.
