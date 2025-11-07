import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 1440, height: 900 }, isMobile: false })

test.describe('Built-for carousel VISUAL debug', () => {
  test('screenshot: carousel area pixels change over time (words are moving)', async ({ page }) => {
    await page.goto('/landing/')

    // Wait for all animations to start (scroll starts at 1.35s)
    await page.waitForTimeout(3000)

    const carousel = page.locator('.built-for-viewport')

    // Take two screenshots 1s apart
    const shot1 = await carousel.screenshot()
    await page.waitForTimeout(1000)
    const shot2 = await carousel.screenshot()

    // Compare raw buffers — if the animation is scrolling, pixels MUST differ
    const same = shot1.equals(shot2)
    if (same) {
      // Save debug screenshots for inspection
      const fs = await import('fs')
      fs.writeFileSync('test-results/carousel-debug-1.png', shot1)
      fs.writeFileSync('test-results/carousel-debug-2.png', shot2)
    }
    expect(same, 'Carousel pixels are identical — animation is NOT moving!').toBe(false)
  })

  test('screenshot: full hero area for visual inspection', async ({ page }) => {
    await page.goto('/landing/')
    await page.waitForTimeout(3000)

    // Save a full hero screenshot for the user to inspect
    const hero = page.locator('.hero')
    await hero.screenshot({ path: 'test-results/hero-desktop-3s.png' })

    // Also log key computed styles for debugging
    const debugInfo = await page.evaluate(() => {
      const viewport = document.querySelector('.built-for-viewport')
      const track = document.querySelector('.built-for-track')
      const parent = document.querySelector('.hero-built-for')
      if (!viewport || !track || !parent) return { error: 'Elements not found', found: { viewport: !!viewport, track: !!track, parent: !!parent } }

      const vs = getComputedStyle(viewport)
      const ts = getComputedStyle(track)
      const ps = getComputedStyle(parent)
      return {
        parent: { opacity: ps.opacity, transform: ps.transform, animation: ps.animation, display: ps.display, visibility: ps.visibility },
        viewport: { opacity: vs.opacity, transform: vs.transform, animation: vs.animation, height: vs.height, overflow: vs.overflow, display: vs.display, visibility: vs.visibility },
        track: { opacity: ts.opacity, transform: ts.transform, animation: ts.animation, display: ts.display, visibility: ts.visibility },
        trackChildren: document.querySelectorAll('.built-for-item').length,
      }
    })
    console.log('DEBUG carousel state at 3s:', JSON.stringify(debugInfo, null, 2))

    // Basic assertions
    expect(debugInfo.trackChildren).toBe(21)
    expect(debugInfo.viewport.opacity).toBe('1')
    expect(debugInfo.parent.opacity).toBe('1')
  })
})
