import { test, expect, type Page } from '@playwright/test'

// These tests exercise the running app against the live backend + simulator.
// Start the backend (port 3000) and simulator before running: `npm run test:e2e`.

async function login(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.fill('#email', email)
  await page.fill('#password', password)
  await page.click('button[type=submit]')
  await expect(page).toHaveURL('http://localhost:5173/')
}

test.describe('dashboard', () => {
  test('logs in and renders the live fleet map', async ({ page }) => {
    await login(page, 'admin@demo.com', 'admin123')
    // 5 seeded vehicles render as markers
    await expect(page.locator('.leaflet-marker-icon')).toHaveCount(5)
    // map tiles load
    expect(await page.locator('.leaflet-tile').count()).toBeGreaterThan(0)
    // connection badge reaches "Live" once socket + services connect
    await expect(page.locator('header').getByText('Live')).toBeVisible({
      timeout: 10_000,
    })
  })

  test('markers move as live telemetry arrives', async ({ page }) => {
    await login(page, 'admin@demo.com', 'admin123')
    const marker = page.locator('.leaflet-marker-icon').first()
    const before = await marker.boundingBox()
    await page.waitForTimeout(5000)
    const after = await marker.boundingBox()
    expect(before && after).toBeTruthy()
    expect(`${before!.x},${before!.y}`).not.toBe(`${after!.x},${after!.y}`)
  })

  test('opens the vehicle sidebar and closes it with Escape', async ({ page }) => {
    await login(page, 'admin@demo.com', 'admin123')
    await page.locator('.leaflet-marker-icon').first().click()
    const sidebar = page.locator('aside')
    await expect(sidebar).toBeVisible()
    await expect(sidebar.getByText('km/h')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(sidebar).toHaveCount(0)
  })
})

test.describe('alerts', () => {
  test('opens the alert panel and acknowledges an alert', async ({ page }) => {
    await login(page, 'admin@demo.com', 'admin123')
    await page.locator('.pi-bell').first().click()
    const panel = page.locator('.max-h-96.w-80')
    await expect(panel).toBeVisible()
    const ackButtons = panel.locator('.pi-check')
    const before = await ackButtons.count()
    test.skip(before === 0, 'no unacknowledged alerts to acknowledge')
    await ackButtons.first().click()
    await expect(panel.locator('.pi-check')).toHaveCount(before - 1)
  })
})

test.describe('geofences (admin)', () => {
  test('draws, saves, and deletes a geofence', async ({ page }) => {
    await login(page, 'admin@demo.com', 'admin123')
    await page.goto('/geofences')

    const drawBtn = page.locator('.leaflet-draw-draw-polygon')
    await expect(drawBtn).toBeVisible()
    await drawBtn.click()

    const map = page.locator('.leaflet-container')
    const b = (await map.boundingBox())!
    const pts = [
      { x: b.x + 500, y: b.y + 250 },
      { x: b.x + 650, y: b.y + 250 },
      { x: b.x + 650, y: b.y + 380 },
      { x: b.x + 500, y: b.y + 380 },
    ]
    for (const p of pts) {
      await page.mouse.click(p.x, p.y)
      await page.waitForTimeout(150)
    }
    await page.mouse.click(pts[0].x, pts[0].y) // close polygon

    await expect(page.getByText('New geofence')).toBeVisible()
    await page.fill('#gf-name', 'E2E Test Zone')
    await page.getByRole('button', { name: 'Save' }).click()

    const row = page.locator('aside li', { hasText: 'E2E Test Zone' })
    await expect(row).toBeVisible()

    await row.locator('.pi-trash').click()
    await expect(row).toHaveCount(0)
  })
})

test.describe('role-based access', () => {
  test('dispatcher cannot reach geofences', async ({ page }) => {
    await login(page, 'dispatcher@demo.com', 'dispatcher123')
    await expect(page.getByRole('link', { name: 'Geofences' })).toHaveCount(0)
    await page.goto('/geofences')
    await expect(page).toHaveURL('http://localhost:5173/')
  })
})

test.describe('responsive', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('vehicle sidebar is a full-width bottom sheet on mobile', async ({ page }) => {
    await login(page, 'admin@demo.com', 'admin123')
    await page.locator('.leaflet-marker-icon').first().click()
    const box = await page.locator('aside').evaluate((el) => {
      const r = el.getBoundingClientRect()
      return {
        position: getComputedStyle(el).position,
        width: Math.round(r.width),
        vw: window.innerWidth,
        bottom: Math.round(r.bottom),
        vh: window.innerHeight,
      }
    })
    expect(box.position).toBe('fixed')
    expect(box.width).toBe(box.vw)
    expect(box.bottom).toBe(box.vh)
    // replay slider is hidden on mobile (present in DOM but display:none)
    await expect(page.locator('.pi-play, .pi-pause').first()).toBeHidden()
  })
})
