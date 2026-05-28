# Fleet Tracker Frontend — Claude Code Context

This file gives Claude Code the context to build and maintain this project. **Always read `API_CONTRACT.md` first** — it is the source of truth that both this repo and the backend repo follow. Then read `CONTRIBUTING.md` for the branching and commit workflow you must follow.

---

## What this app does

A Vue 3 single-page app that:

1. **Authenticates** against the backend (JWT) with seed credentials
2. **Displays a live map** of vehicles updating in real time via Socket.io
3. **Shows per-vehicle metrics** (speed, fuel, status) in a sidebar when a vehicle is selected
4. **Replays history** for any vehicle via a time-slider control
5. **Surfaces alerts** in a top notification panel (speed violations, geofence exits, low fuel)
6. **Lets admins manage geofences** via drawn polygons on the map

---

## Tech stack (use these exactly)

| Concern | Library |
|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Build tool | Vite 5 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| UI components | PrimeVue 4 (use the Aura theme) |
| Icons | PrimeIcons (already bundled with PrimeVue) |
| State | Pinia |
| Routing | vue-router 4 |
| HTTP | axios |
| Realtime | socket.io-client |
| Maps | Leaflet 1.9 + @vue-leaflet/vue-leaflet |
| Charts | Chart.js 4 + vue-chartjs |
| Forms | vee-validate + zod |
| Validation | zod (same schema as backend where possible) |
| Date utils | date-fns |

**Do not introduce new dependencies without asking the user.**

---

## Directory layout (target)

```
src/
  main.ts                   ← Vue app bootstrap, plugins, PrimeVue + Tailwind
  App.vue                   ← shell with router-view
  router/
    index.ts                ← routes + auth guards
  stores/
    auth.ts                 ← Pinia store: user, token, login/logout
    vehicles.ts             ← live vehicle state, keyed by vehicleId
    alerts.ts               ← live alert list
    geofences.ts            ← geofence CRUD (admin only)
    connection.ts           ← Socket.io + MQTT connection status
  services/
    api.ts                  ← axios instance with auth interceptor
    socket.ts               ← Socket.io client wrapper, typed events
    auth.ts                 ← login + me API calls
    vehicles.ts             ← vehicles + history API calls
    alerts.ts               ← alerts API calls
    geofences.ts            ← geofences API calls
  views/
    LoginView.vue
    DashboardView.vue       ← the main map + sidebar layout
    GeofencesView.vue       ← admin-only geofence management
  components/
    map/
      FleetMap.vue          ← Leaflet map with vehicle markers
      VehicleMarker.vue
      GeofencePolygon.vue
      HistoryReplaySlider.vue
    sidebar/
      VehicleSidebar.vue    ← live metrics for selected vehicle
      VehicleListItem.vue
      VehicleSpeedChart.vue ← Chart.js spark line for last 5 min
    alerts/
      AlertToast.vue
      AlertList.vue
      AlertItem.vue
    auth/
      LoginForm.vue
    layout/
      AppHeader.vue
      ConnectionBadge.vue   ← shows MQTT/InfluxDB connectivity status
  types/
    api.ts                  ← types matching API_CONTRACT.md responses
    socket-events.ts        ← shared typed event interface
  composables/
    useSocket.ts            ← reactive Socket.io connection
    useVehicles.ts          ← subscribes to vehicle:update events
    useAlerts.ts            ← subscribes to alert:new events
  utils/
    geo.ts                  ← coordinate helpers
    format.ts               ← speed/fuel/time formatters
  assets/
    main.css                ← Tailwind directives + custom CSS vars
public/
  favicon.svg
index.html
package.json
tsconfig.json
vite.config.ts
.env.example
.env                        ← gitignored
```

---

## Conventions

- **Composition API + `<script setup lang="ts">`** everywhere. No Options API.
- **Strict TypeScript.** No `any`. Use Vue's `defineProps<T>()` generic form.
- **One component per file.** Filename PascalCase, root element kebab-case in template.
- **Pinia stores for shared state.** Component-local state stays in `ref`/`reactive` inside `<script setup>`.
- **API calls go through `services/` only.** Components never call axios directly.
- **Socket.io events go through `services/socket.ts` only**, exposed via composables.
- **All routes have auth guards.** Unauthenticated users redirect to `/login`. Non-admins on `/geofences` redirect to `/`.
- **Tailwind 4** with the new CSS-first config. Use `@import "tailwindcss"` in `main.css`.
- **PrimeVue Aura theme** with unstyled mode + Tailwind for layout; PrimeVue handles components (DataTable, Dialog, Toast, etc.).
- **Dark mode by default** — looks more professional for industrial use cases.

---

## Git workflow (NON-NEGOTIABLE)

Read `CONTRIBUTING.md` for the full rules. The short version:

1. **NEVER commit directly to `main`** except for trivial doc-only changes.
2. **Every phase happens on its own branch** named `feat/phase-N-<slug>` or `chore/phase-N-<slug>`.
3. **Every phase ends with a Pull Request**, NOT a direct merge to main.
4. **Wait for the user's explicit "verified, merge it" confirmation** before merging the PR.
5. **Use Conventional Commits** for every commit.
6. **Commit in small logical chunks** within a phase, not one giant commit at the end.

### Per-phase git ritual

```bash
git checkout main && git pull origin main
git checkout -b <type>/phase-N-<slug>
# ... do the work, multiple small commits ...
git push -u origin <branch>
gh pr create --title "Phase N — <name>" --body "<summary + verification output>"
# WAIT for user to confirm verification passed and say "merge it"
gh pr merge --squash --delete-branch
```

---

## Build phases (execute in order)

When the user gives you the initial prompt, execute these phases in order. **For each phase:**

1. Create the phase branch
2. Implement the phase
3. Commit in small logical chunks with conventional messages
4. Run the verification
5. Push the branch and open a PR
6. **PAUSE — do NOT merge.** Wait for the user to confirm
7. Only after user says "merge it" → `gh pr merge --squash --delete-branch`

### Phase 1 — Project skeleton
Branch: `chore/phase-1-project-skeleton`
- Initialize Vite + Vue 3 + TS file structure (don't run `npm create vite@latest` — we have `package.json`)
- Install PrimeVue 4, Tailwind 4, Pinia, vue-router
- Configure PrimeVue with Aura theme, dark mode
- Configure Tailwind 4 (CSS-first config in `main.css`)
- Add `vite.config.ts` with path aliases (`@/` → `src/`)
- Add a placeholder `App.vue` showing "Fleet Tracker" with a working PrimeVue Button
- **Verify:** `npm run dev` opens at `:5173` showing the dark-themed placeholder

### Phase 2 — Routing + auth shell
Branch: `feat/phase-2-routing-auth-shell`
- Add routes: `/login`, `/`, `/geofences`
- Build `LoginView.vue` with email/password form using PrimeVue InputText + Button, vee-validate + zod
- Build `AppHeader.vue` with logout button + user display + connection badge slot
- Pinia `auth` store with login action, token persistence in localStorage
- Route guards: redirect to `/login` if no token; redirect to `/` after login
- Axios instance with interceptor that attaches `Authorization: Bearer <token>`
- **Verify:** With backend running, login with `admin@demo.com` / `admin123` → see empty dashboard with header

### Phase 3 — Fleet map (no data yet)
Branch: `feat/phase-3-fleet-map`
- Install Leaflet + vue-leaflet
- Build `FleetMap.vue` with OpenStreetMap tile layer
- Center on Hyderabad, Pakistan (lat: 25.397, lng: 68.367), zoom 12
- Build `VehicleMarker.vue` (custom div icon with color by status)
- Render 5 hardcoded markers as static dots
- **Verify:** Map renders, 5 dots visible

### Phase 4 — Live data from backend
Branch: `feat/phase-4-live-data`
- Build `services/api.ts` + `services/vehicles.ts` (typed against API_CONTRACT.md)
- Pinia `vehicles` store: fetches `/api/vehicles` on dashboard mount
- Render real vehicles on the map from store data
- **Verify:** Refresh page after login → 5 real vehicles from the backend render on map

### Phase 5 — Socket.io connection
Branch: `feat/phase-5-socketio`
- Build `services/socket.ts` with typed Server→Client and Client→Server events matching API_CONTRACT.md
- Connect with JWT in `auth` payload on dashboard mount, disconnect on unmount
- Composable `useSocket()` exposing connection status + emitter
- Composable `useVehicles()` subscribes to `vehicle:update` events and updates the Pinia store
- `ConnectionBadge.vue` in header shows connection status (green/amber/red)
- **Verify:** With backend + simulator running, vehicles visibly move on the map every 2s

### Phase 6 — Vehicle sidebar
Branch: `feat/phase-6-vehicle-sidebar`
- Build `VehicleSidebar.vue` — opens when a marker is clicked
- Show: name, status, current speed (large), fuel (progress bar), last update
- Add `VehicleSpeedChart.vue` — Chart.js sparkline of speed over last 5 min
- Close button + click-outside to deselect
- **Verify:** Click a moving vehicle → sidebar opens with live updating metrics

### Phase 7 — History replay
Branch: `feat/phase-7-history-replay`
- Add `HistoryReplaySlider.vue` — full-width slider at bottom showing last 1 hour
- When user drags, fetch `/api/vehicles/:id/history` and animate vehicle markers along the polyline
- Play/pause button + speed control (1x, 2x, 5x)
- Show breadcrumb trail of historical positions
- **Verify:** After simulator has been running ~5 min, drag slider → vehicles animate along their past route

### Phase 8 — Alerts
Branch: `feat/phase-8-alerts`
- Pinia `alerts` store fetches `/api/alerts` + subscribes to `alert:new`
- `AlertToast.vue` — uses PrimeVue Toast for new alerts
- `AlertList.vue` — collapsible panel in header showing recent alerts with severity colors
- Click an alert → map zooms to that vehicle, sidebar opens
- Acknowledge button → calls `POST /api/alerts/:id/acknowledge`
- **Verify:** Simulator triggers a speed violation → toast appears, alert in list, click-to-zoom works

### Phase 9 — Geofences (admin only)
Branch: `feat/phase-9-geofences`
- `GeofencesView.vue` with map + drawing tools (leaflet-draw)
- List existing geofences in a sidebar, CRUD via API
- Render geofence polygons on the main dashboard map too (semi-transparent)
- Route guard: non-admin redirects to `/`
- **Verify:** Login as admin → draw a polygon → save → see it on dashboard map; login as dispatcher → /geofences redirects

### Phase 10 — Polish
Branch: `chore/phase-10-polish`
- Loading skeletons (PrimeVue Skeleton) for initial data fetch
- Empty states ("No alerts in last 24h")
- Keyboard shortcuts (Esc closes sidebar)
- Mobile responsive layout (sidebar becomes bottom sheet on narrow screens)
- README with screenshots, run instructions, link to backend repo
- **Verify:** Run through all flows on mobile (Chrome devtools) — everything usable

---

## Things to NOT do

- Don't add SSR — this is a SPA
- Don't add a state library other than Pinia
- Don't use Options API
- Don't write CSS in `<style>` blocks unless absolutely necessary — Tailwind utilities or PrimeVue passthrough
- Don't bypass `services/` or hit Socket.io directly from components
- Don't commit `.env`
- Don't commit directly to `main` — always work on a phase branch
- Don't merge a PR on your own initiative — wait for user confirmation

---

## When you're stuck

Ask the user. Don't guess at:
- Whether to deviate from `API_CONTRACT.md` (it must match the backend exactly)
- Whether to add a UI library other than PrimeVue
- Whether to add map providers other than Leaflet + OpenStreetMap
- Whether to merge a PR (always wait for confirmation)