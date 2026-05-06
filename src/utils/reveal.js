import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { PRIMARY_EASE } from './eases'

/**
 * Split a text element into masked lines so a `gsap.from(split.lines, ...)`
 * reads as a clean line-by-line reveal. Returns the SplitText instance —
 * `gsap.context` will revert it on cleanup.
 */
export function splitLines(el, { linesClass = 'reveal-line' } = {}) {
  // autoSplit: SplitText re-measures when fonts finish loading or the container
  // resizes, so mobile/desktop transitions and late web-font swaps don't leave
  // orphan words from a stale line measurement.
  return new SplitText(el, { type: 'lines', mask: 'lines', linesClass, autoSplit: true })
}

/**
 * Tween factory for a line-mask reveal: lines slide up from `yPercent: 100`
 * while fading from `opacity: 0`, eased on the brand `primary` curve.
 * Pass into `tl.from(split.lines, lineRevealVars(...))`.
 */
export function lineRevealVars({ duration = 1, stagger = 0.08 } = {}) {
  return {
    yPercent: 100,
    opacity: 0,
    duration,
    ease: PRIMARY_EASE,
    stagger,
  }
}

/**
 * Pre-hide state for a block reveal (call from `prepare`). Sets the element
 * to its hidden offset so a later `gsap.to` resolves it to the visible state.
 */
export function blockRevealFromVars({ y = 24 } = {}) {
  return { autoAlpha: 0, y }
}

/**
 * Tween-to state for a block reveal: fades in + translates up to its
 * resting position. Use for non-text containers (cards, images, video,
 * button groups) that shouldn't be split into lines.
 */
export function blockRevealVars({ duration = 1, stagger = 0.1 } = {}) {
  return {
    autoAlpha: 1,
    y: 0,
    duration,
    ease: PRIMARY_EASE,
    stagger,
  }
}

/**
 * Build a one-shot ScrollTrigger config keyed on the *element itself*
 * (not the section it lives in), so each heading / card / image animates
 * the moment it enters the viewport. Pass any overrides as a second arg.
 */
export function selfTrigger(el, overrides = {}) {
  return { trigger: el, start: 'top 85%', once: true, ...overrides }
}
