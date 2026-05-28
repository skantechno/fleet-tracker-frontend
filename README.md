# fleet-tracker-frontend

Real-time IoT fleet tracking dashboard. Vue 3 + PrimeVue + Tailwind, with a live Leaflet map, vehicle telemetry sidebar, historical replay, and admin geofence management.

> Companion repo: [`fleet-tracker-backend`](https://github.com/skantechno/fleet-tracker-backend)
> Live demo: _(add URL after deployment)_

## Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite 5** + TypeScript (strict)
- **PrimeVue 4** with Aura theme (dark mode)
- **Tailwind CSS 4** (CSS-first config)
- **Pinia** for state
- **vue-router 4** with auth guards
- **Leaflet** + vue-leaflet for the map
- **socket.io-client** for real-time updates
- **Chart.js** for time-series charts
- **vee-validate + zod** for forms

## Quick start

```bash
# 1. Make sure backend is running (see fleet-tracker-backend)

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start dev server
npm run dev
```

Opens at `http://localhost:5173`.

## Login

| Email | Password | Role |
|---|---|---|
| admin@demo.com | admin123 | admin |
| dispatcher@demo.com | dispatcher123 | dispatcher |

## Features

- **Live map** with 5 vehicles updating every 2s via Socket.io
- **Vehicle sidebar** with live speed/fuel and 5-minute speed sparkline
- **Historical replay** with play/pause + 1x/2x/5x speed controls
- **Alert toasts + panel** for speed violations, geofence exits, low fuel
- **Geofence drawing** (admin) with polygon tools on the map
- **Connection status badge** showing MQTT + Socket.io health

## Project structure

See `CLAUDE.md` for the full architecture and contribution conventions.
