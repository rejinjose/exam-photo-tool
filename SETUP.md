# Setup — do this once

You'll use Claude Code inside the **Claude desktop app (Code tab)** in a **Local** session.
It runs commands on your Mac, so `git`, `gh` and Node must be installed here.
Claude in Chrome is not needed for this workflow.

## 1. Install tools

- Node.js 22 LTS — https://nodejs.org
- Git — https://git-scm.com
- GitHub CLI — https://cli.github.com
- Claude desktop app (already installed) — use its **Code** tab. The terminal `claude`
  command needs macOS 13+, so skip it on this Mac.

Check (in Terminal, or the Code tab's built-in terminal):
```bash
node -v && git --version && gh --version
```

## 2. Set your Git identity

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## 3. Log in to GitHub

```bash
gh auth login
```
Choose: GitHub.com → HTTPS → Login with a web browser. It opens GitHub in Chrome,
where you're already logged in; enter the code shown in the terminal and approve.

Then let git use that login for pushes:
```bash
gh auth setup-git
```

## 4. Create the project folder

Unzip this kit into a new folder (e.g. `exam-photo-tool`). Make sure the hidden folders
`.claude`, `.github` and `.husky` came along (turn on "show hidden files" to check).

## 5. Create the GitHub repo and push the kit

From inside the folder:
```bash
git init -b main
git add .
git commit -m "chore: starter kit"
gh repo create exam-photo-tool --public --source=. --remote=origin --push
```
A **public** repo works as a portfolio piece, and branch protection with required
checks is available for public repos on GitHub's free plan.

## 6. Start working

Claude app → **Code** tab → new session → environment **Local** → select the project folder.
Then type:
```
/my-ticket
```
It picks T-01 (project scaffold), builds it on branch `T-01-...`, runs tests, opens a PR,
waits for CI, and stops for you.

## 7. Your loop per ticket

1. `/my-ticket`
2. Read the summary, open the PR, try it locally (`npm run dev`) or on the preview deploy.
3. Reply `merge` (or ask for changes).
4. Start a new session for the next ticket so each ticket starts with a clean context.

## 8. Protect `main` (after T-02 is merged)

Repo on GitHub → Settings → branch protection rules (or rulesets) for `main`:
require a pull request and require the `check` status to pass.
From then on, nothing reaches `main` without green tests, even by mistake.

## 9. Cloudflare Pages (before T-04)

See ticket H-3 in `docs/backlog/BACKLOG.md`. Once connected, every merge to `main`
deploys automatically, and each PR branch gets its own preview URL.

---

## Safety layers in this kit

| Layer | What it stops |
|---|---|
| `CLAUDE.md` + `/my-ticket` skill | Claude skipping steps or working on several tickets |
| `.claude/settings.json` | Claude pushing to `main`, force-pushing, `reset --hard` |
| `.husky/pre-commit` | Any commit with failing lint/types/tests (active after T-01) |
| GitHub Actions CI | Any PR with failing tests or smoke test |
| Branch protection | Anything reaching `main` without a PR and green CI |

## Switching to auto-merge (optional)

By default Claude stops before merging and waits for your "merge".
`gh pr merge` is deliberately not in the allow list, so Claude Code also asks permission.
To merge automatically once CI is green:
1. In `.claude/skills/my-ticket/SKILL.md`, set `MERGE_MODE: auto`.
2. Add `"Bash(gh pr merge:*)"` to `allow` in `.claude/settings.json`.

Permission and settings syntax can change between Claude Code versions. If something
doesn't behave as expected, run `/permissions` or check the Claude Code docs.
