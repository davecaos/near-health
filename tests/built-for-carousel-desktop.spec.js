import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 1440, height: 900 }, isMobile: false })

test.describe('Built-for carousel on desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/landing/')
  })

  test('desktop carousel track exists with scroll animation', async ({ page }) => {
    const track = page.locator('.built-for-track')
    await expect(track).toBeAttached({ timeout: 3000 })

    const animation = await track.evaluate(el => getComputedStyle(el).animationName)
    expect(animation).toContain('built-for-scroll-v')
  })

  test('desktop viewport becomes visible after fade delay', async ({ page }) => {
    const viewport = page.locator('.built-for-viewport')
    // fade-in-track fires at 1.05s delay + 0.3s duration
    await page.waitForTimeout(2000)
    const opacity = await viewport.evaluate(el => getComputedStyle(el).opacity)
    expect(Number(opacity)).toBe(1)
  })

  test('desktop carousel is actively scrolling (not frozen)', async ({ page }) => {
    const track = page.locator('.built-for-track')
    await page.waitForTimeout(2000)

    const getTransform = () => track.evaluate(el => getComputedStyle(el).transform)
    const t1 = await getTransform()
    await page.waitForTimeout(500)
    const t2 = await getTransform()

    expect(t1).not.toBe(t2)
  })

  test('desktop divider line expands via CSS animation', async ({ page }) => {
    const divider = page.locator('.built-for-divider')
    await expect(divider).toBeAttached({ timeout: 3000 })

    // divider-grow: 0.25s delay + 0.8s duration ≈ 1.05s
    await page.waitForTimeout(1500)
    const width = await divider.evaluate(el => el.getBoundingClientRect().width)
    expect(width).toBeGreaterThan(50)
  })
})
