You are starting work on `fleet-tracker-frontend`. This is a fresh repo with starter files already in place: `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`, `README.md`, `CLAUDE.md`, `CONTRIBUTING.md`, and `API_CONTRACT.md`.

**Before you write any code, read these four files in this order:**

1. `CLAUDE.md` — full context on what this app does, the tech stack, conventions, and the 10 build phases
2. `CONTRIBUTING.md` — the git workflow you must follow (branching, commits, PRs)
3. `API_CONTRACT.md` — the contract that both this repo and the backend repo follow
4. `package.json` — confirms the dependencies you have available

---

## Pre-flight check: backend + git state

### Backend must be running

```bash
curl http://localhost:3000/health
# Should return {"status":"ok"}
```

If the backend isn't running, STOP and ask the user to start it first. (Backend Phase 4 must be merged before this repo's Phase 4 can be verified.)

### Git state

```bash
git branch --show-current      # should print "main"
git log --oneline -5            # should show at least the initial scaffold commit
git remote -v                   # should show "origin" pointing to GitHub
```

If any fails, STOP and ask the user to run the bootstrap commands from `BOOTSTRAP_AND_BRANCHING.md`.

---

## Your task

Execute the 10 build phases listed in `CLAUDE.md` **one phase at a time, each on its own branch, ending each with a PR**.

For every phase:

1. From `main`, create the phase branch
2. Implement the phase per `CLAUDE.md`
3. Commit in small logical chunks using **Conventional Commits**
4. Run the verification (open the browser, click around, screenshot/describe)
5. Push the branch and open a PR:
   ```bash
   git push -u origin <branch>
   gh pr create --title "Phase N — <name>" --body "<summary including verification>"
   ```
6. **STOP. Do NOT merge the PR.** Wait for the user to confirm and say "merge it."
7. Once confirmed:
   ```bash
   gh pr merge --squash --delete-branch
   git checkout main && git pull
   ```
8. Wait for the user's instruction before starting the next phase.

Do not skip ahead. Do not combine phases. Do not commit to main directly.

---

## Start now

Begin **Phase 1 — Project skeleton**.

```bash
git checkout main && git pull origin main
git checkout -b chore/phase-1-project-skeleton
```

Expected deliverable:
- Vite + Vue 3 + TS project initialized in place (don't run `npm create vite@latest` — we already have `package.json`; create the file structure manually)
- `vite.config.ts` with `@vitejs/plugin-vue`, `@tailwindcss/vite`, and path alias `@/` → `src/`
- `index.html` with `<div id="app">`
- `src/main.ts` bootstrapping Vue with Pinia + vue-router + PrimeVue (Aura preset, dark mode) + Tailwind imports
- `src/App.vue` as a shell with `<RouterView />`
- `src/router/index.ts` with one placeholder route `/`
- `src/assets/main.css` with Tailwind 4 directives
- A placeholder home view showing "Fleet Tracker" with a working PrimeVue Button
- A `.vscode/extensions.json` recommending Vue (Volar) + Tailwind CSS IntelliSense

Verification: `npm run dev` opens at `http://localhost:5173` showing a dark-themed page with the title and a clickable PrimeVue button.

When verification passes, open the PR with title `Phase 1 — Project skeleton` and STOP. I will inspect and tell you "merge it" when I'm satisfied.

---

## Working agreement

- **Composition API + `<script setup lang="ts">`** everywhere. No Options API.
- **Strict TypeScript.** No `any`.
- **Pinia for shared state.** Components don't import axios or socket.io-client directly — they go through `services/`.
- **All routes have auth guards.** Unauthenticated → `/login`. Non-admin on admin routes → `/`.
- **No new dependencies** beyond what's in `package.json` without asking me first.
- **Tailwind utilities and PrimeVue passthrough** for styling.
- **Branch per phase. PR per phase. Wait for my approval before merging.**
- **Conventional Commits** for every commit.

Proceed.