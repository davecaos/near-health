import { test, expect } from '@playwright/test'

const SECTIONS = [
  { selector: '.navbar',            name: 'navbar' },
  { selector: '#hero',              name: 'hero' },
  { selector: '#built-for',         name: 'care-journey' },
  { selector: '#member-experience', name: 'member-experience' },
  { selector: '#how-it-works',      name: 'how-it-works' },
  { selector: '#why-near',          name: 'post-enrollment' },
  { selector: '#one-platform',      name: 'one-platform' },
  { selector: '#real-world',        name: 'real-world' },
  { selector: '#shaped',            name: 'shaped-section' },
  { selector: '#care-connected',    name: 'care-connected', lottie: true },
  { selector: '#contact',           name: 'footer-cta' },
  { selector: '.footer',            name: 'footer' },
]

test.describe('Section visual regression', () => {
  test.beforeEach(async ({ page }) => {
    // Force lazy images to load eagerly — CareJourney cards below the fold
    // would otherwise stay unloaded since these tests don't scroll.
    await page.addInitScript(() => {
      Object.defineProperty(HTMLImageElement.prototype, 'loading', {
        configurable: true,
        get() { return 'eager' },
        set() {},
      })
    })

    await page.goto('/landing/', { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)

    // useFadeIn is IntersectionObserver-driven JS, so animations: 'disabled'
    // doesn't reach it. Force .fade-in to its visible state so off-screen
    // sections render fully without us scrolling them into view.
    await page.addStyleTag({
      content: '.fade-in { opacity: 1 !important; transform: none !important; transition: none !important; }',
    })
  })

  for (const section of SECTIONS) {
    test(`${section.name} looks correct`, async ({ page }) => {
      const locator = page.locator(section.selector)
      const mask = section.lottie ? [page.locator(`${section.selector} .lottie-bg`)] : []

      await expect(locator).toHaveScreenshot(`${section.name}.png`, {
        animations: 'disabled',
        mask,
      })
    })
  }
})
